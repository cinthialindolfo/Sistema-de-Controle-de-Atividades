'use server'

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Função auxiliar para pegar o DB apenas no servidor
async function getDb() {
  const libDb = await import('../lib/db');
  return libDb.default;
}

export async function getActivities(filters?: any) {
  try {
    const db = await getDb();
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
    
    const activities = db.prepare(query).all(...params);
    return { success: true, data: activities };
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return { success: false, error: "Falha ao carregar atividades" };
  }
}

export async function createActivity(formData: FormData) {
  try {
    const db = await getDb();
    const id = Math.random().toString(36).substring(2, 11);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const category = formData.get("category") as string;
    const teamResponsible = formData.get("teamResponsible") as string;
    const personResponsible = formData.get("personResponsible") as string;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO Activity (id, title, description, priority, category, teamResponsible, personResponsible, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDENTE', ?, ?)
    `).run(id, title, description, priority, category, teamResponsible, personResponsible, now, now);

    revalidatePath("/");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    return { success: false, error: "Falha ao criar atividade" };
  }
}

export async function updateActivity(id: string, formData: FormData) {
  try {
    const db = await getDb();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const category = formData.get("category") as string;
    const teamResponsible = formData.get("teamResponsible") as string;
    const personResponsible = formData.get("personResponsible") as string;
    const status = formData.get("status") as string;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE Activity 
      SET title = ?, description = ?, priority = ?, category = ?, teamResponsible = ?, personResponsible = ?, status = ?, updatedAt = ?
      WHERE id = ?
    `).run(title, description, priority, category, teamResponsible, personResponsible, status, now, id);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    return { success: false, error: "Falha ao atualizar atividade" };
  }
}

export async function deleteActivity(id: string) {
  try {
    const db = await getDb();
    db.prepare("DELETE FROM Activity WHERE id = ?").run(id);
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
    const db = await getDb();
    let user = db.prepare("SELECT * FROM User WHERE firstName = ? AND lastName = ?").get(firstName, lastName) as any;

    if (!user) {
      const id = Math.random().toString(36).substring(2, 11);
      const now = new Date().toISOString();
      db.prepare("INSERT INTO User (id, firstName, lastName, pin, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)").run(id, firstName, lastName, pin, now, now);
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

    const db = await getDb();
    return db.prepare("SELECT * FROM User WHERE id = ?").get(userId) as any;
  } catch (error) {
    return null;
  }
}
