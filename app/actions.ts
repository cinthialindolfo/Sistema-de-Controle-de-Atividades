'use server'

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Função auxiliar para pegar o DB e saber se é nuvem ou local
async function getDbInstance() {
  const { default: db, isCloud } = await import('../lib/db');
  return { db, isCloud };
}

export async function getActivities(filters?: any) {
  try {
    const { db, isCloud } = await getDbInstance();
    let query = "SELECT * FROM Activity WHERE 1=1";
    const params: any[] = [];

    if (filters?.search) {
      query += " AND title LIKE ?";
      params.push(`%${filters.search}%`);
    }
    if (filters?.priority && filters.priority !== "all") {
      query += " AND priority = ?";
      params.push(filters.priority);
    }
    if (filters?.status && filters.status !== "all") {
      query += " AND status = ?";
      params.push(filters.status);
    }
    if (filters?.category && filters.category !== "all") {
      query += " AND category = ?";
      params.push(filters.category);
    }
    if (filters?.teamResponsible) {
      query += " AND teamResponsible LIKE ?";
      params.push(`%${filters.teamResponsible}%`);
    }
    if (filters?.personResponsible) {
      query += " AND personResponsible LIKE ?";
      params.push(`%${filters.personResponsible}%`);
    }

    query += " ORDER BY createdAt DESC";
    
    // Suporte para Turso (execute) vs better-sqlite3 (all)
    const activities = isCloud 
      ? (await db.execute({ sql: query, args: params })).rows
      : db.prepare(query).all(...params);

    return { success: true, data: activities };
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return { success: false, error: "Falha ao carregar atividades" };
  }
}

export async function createActivity(formData: FormData) {
  try {
    const { db, isCloud } = await getDbInstance();
    const id = Math.random().toString(36).substring(2, 11);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const category = formData.get("category") as string;
    const teamResponsible = formData.get("teamResponsible") as string;
    const personResponsible = formData.get("personResponsible") as string;
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO Activity (id, title, description, priority, category, teamResponsible, personResponsible, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDENTE', ?, ?)
    `;
    const args = [id, title, description, priority, category, teamResponsible, personResponsible, now, now];

    if (isCloud) {
      await db.execute({ sql, args });
    } else {
      db.prepare(sql).run(...args);
    }

    revalidatePath("/");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    return { success: false, error: "Falha ao criar atividade" };
  }
}

export async function updateActivity(id: string, formData: FormData) {
  try {
    const { db, isCloud } = await getDbInstance();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const category = formData.get("category") as string;
    const teamResponsible = formData.get("teamResponsible") as string;
    const personResponsible = formData.get("personResponsible") as string;
    const status = formData.get("status") as string;
    const now = new Date().toISOString();

    const sql = `
      UPDATE Activity 
      SET title = ?, description = ?, priority = ?, category = ?, teamResponsible = ?, personResponsible = ?, status = ?, updatedAt = ?
      WHERE id = ?
    `;
    const args = [title, description, priority, category, teamResponsible, personResponsible, status, now, id];

    if (isCloud) {
      await db.execute({ sql, args });
    } else {
      db.prepare(sql).run(...args);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    return { success: false, error: "Falha ao atualizar atividade" };
  }
}

export async function deleteActivity(id: string) {
  try {
    const { db, isCloud } = await getDbInstance();
    const sql = "DELETE FROM Activity WHERE id = ?";
    
    if (isCloud) {
      await db.execute({ sql, args: [id] });
    } else {
      db.prepare(sql).run(id);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir atividade:", error);
    return { success: false, error: "Falha ao excluir atividade" };
  }
}

export async function login(formData: FormData) {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const pin = formData.get("pin") as string;

  if (!firstName || !lastName || !pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
    return { success: false, error: "Preencha Nome, Sobrenome e PIN de 4 dígitos." };
  }

  try {
    const { db, isCloud } = await getDbInstance();
    
    // Garante que as tabelas existam no Turso/Nuvem também
    if (isCloud) {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS User (
          id TEXT PRIMARY KEY,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          pin TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(firstName, lastName)
        )
      `);
      await db.execute(`
        CREATE TABLE IF NOT EXISTS Activity (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          priority TEXT NOT NULL,
          category TEXT NOT NULL,
          teamResponsible TEXT NOT NULL,
          personResponsible TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDENTE',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    let user;
    const findSql = "SELECT * FROM User WHERE firstName = ? AND lastName = ?";
    
    if (isCloud) {
      const result = await db.execute({ sql: findSql, args: [firstName, lastName] });
      user = result.rows[0];
    } else {
      user = db.prepare(findSql).get(firstName, lastName);
    }

    if (!user) {
      const id = Math.random().toString(36).substring(2, 11);
      const now = new Date().toISOString();
      const insertSql = "INSERT INTO User (id, firstName, lastName, pin, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)";
      const insertArgs = [id, firstName, lastName, pin, now, now];
      
      if (isCloud) {
        await db.execute({ sql: insertSql, args: insertArgs });
      } else {
        db.prepare(insertSql).run(...insertArgs);
      }
      user = { id, firstName, lastName, pin };
    } else if (user.pin !== pin) {
      return { success: false, error: "PIN incorreto para este usuário." };
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    console.error("ERRO NO LOGIN:", error);
    return { success: false, error: "Erro ao processar login." };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect("/login");
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId) return null;

    const { db, isCloud } = await getDbInstance();
    const sql = "SELECT * FROM User WHERE id = ?";
    
    if (isCloud) {
      const result = await db.execute({ sql, args: [userId] });
      return result.rows[0];
    } else {
      return db.prepare(sql).get(userId);
    }
  } catch (error) {
    return null;
  }
}
