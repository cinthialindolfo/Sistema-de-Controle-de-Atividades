'use server'

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDb, isCloud } from '../lib/db';

/**
 * Nota: getDb() agora é assíncrona para suportar o isolamento do better-sqlite3 no build.
 */

export async function getActivities(filters?: any) {
  try {
    const db = await getDb();
    let baseQuery = "FROM Activity WHERE 1=1";
    const params: any[] = [];

    if (filters?.search) {
      baseQuery += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    if (filters?.priority && filters.priority !== "all") {
      baseQuery += " AND priority = ?";
      params.push(filters.priority);
    }
    if (filters?.status && filters.status !== "all") {
      baseQuery += " AND status = ?";
      params.push(filters.status);
    }
    if (filters?.category && filters.category !== "all") {
      baseQuery += " AND category = ?";
      params.push(filters.category);
    }
    if (filters?.teamResponsible) {
      baseQuery += " AND teamResponsible LIKE ?";
      params.push(`%${filters.teamResponsible}%`);
    }
    if (filters?.personResponsible) {
      baseQuery += " AND personResponsible LIKE ?";
      params.push(`%${filters.personResponsible}%`);
    }

    // Calcular o total de registros (para paginação)
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    let totalRecords = 0;
    
    if (isCloud) {
      const countResult = await (db as any).execute({ sql: countQuery, args: params });
      totalRecords = countResult.rows[0].total as number;
    } else {
      const countResult = (db as any).prepare(countQuery).get(...params);
      totalRecords = countResult.total as number;
    }

    // Lógica de Paginação (10 itens por página), exceto se for explicitly limit=1000
    const limit = filters?.limit ? parseInt(filters.limit, 10) : 10;
    const page = filters?.page ? parseInt(filters.page, 10) : 1;
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalRecords / limit);

    // Adicionar ordenação e limites à query principal
    let query = `SELECT * ${baseQuery} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    const paginatedParams = [...params, limit, offset];
    
    const activities = isCloud 
      ? (await (db as any).execute({ sql: query, args: paginatedParams })).rows
      : (db as any).prepare(query).all(...paginatedParams);

    return { 
      success: true, 
      data: activities,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages
      }
    };
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return { success: false, error: "Falha ao carregar atividades" };
  }
}



export async function createActivityAction(formData: FormData) {
  try {
    const db = await getDb();
    
    // 1. Extração de Campos
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const priority = formData.get("priority")?.toString();
    const category = formData.get("category")?.toString();
    const teamResponsible = formData.get("teamResponsible")?.toString().trim();
    const personResponsible = formData.get("personResponsible")?.toString().trim();

    // 2. Validação Estrita (Sênior)
    if (!title) return { success: false, error: "O título é obrigatório." };
    if (!description) return { success: false, error: "A descrição é obrigatória." };
    if (!priority) return { success: false, error: "A prioridade é obrigatória." };
    if (!category) return { success: false, error: "A categoria é obrigatória." };
    if (!teamResponsible) return { success: false, error: "O time responsável é obrigatório." };
    if (!personResponsible) return { success: false, error: "A pessoa responsável é obrigatória." };

    // 3. Automação e Metadados
    const id = Math.random().toString(36).substring(2, 11);
    const status = "PENDENTE"; // Sempre Pendente na criação
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO Activity (id, title, description, priority, category, teamResponsible, personResponsible, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const args = [id, title, description, priority, category, teamResponsible, personResponsible, status, now, now];

    if (isCloud) {
      await (db as any).execute({ sql, args });
    } else {
      (db as any).prepare(sql).run(...args);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao criar atividade:", error.message || error);
    return { success: false, error: "Falha interna ao salvar a atividade." };
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

    const sql = `
      UPDATE Activity 
      SET title = ?, description = ?, priority = ?, category = ?, teamResponsible = ?, personResponsible = ?, status = ?, updatedAt = ?
      WHERE id = ?
    `;
    const args = [title, description, priority, category, teamResponsible, personResponsible, status, now, id];

    if (isCloud) {
      await (db as any).execute({ sql, args });
    } else {
      (db as any).prepare(sql).run(...args);
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
    const db = await getDb();
    const sql = "DELETE FROM Activity WHERE id = ?";
    
    if (isCloud) {
      await (db as any).execute({ sql, args: [id] });
    } else {
      (db as any).prepare(sql).run(id);
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
    const db = await getDb();

    // SQL de Inicialização (Idempotente)
    const initUserSql = `
      CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        pin TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(firstName, lastName)
      )
    `;
    const initActivitySql = `
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
    `;

    // Garante tabelas antes de prosseguir
    if (isCloud) {
      await (db as any).execute(initUserSql);
      await (db as any).execute(initActivitySql);
    } else {
      (db as any).exec(initUserSql);
      (db as any).exec(initActivitySql);
    }

    let user;
    const findSql = "SELECT * FROM User WHERE firstName = ? AND lastName = ?";

    if (isCloud) {
      const result = await (db as any).execute({ sql: findSql, args: [firstName, lastName] });
      user = result.rows[0];
    } else {
      user = (db as any).prepare(findSql).get(firstName, lastName);
    }

    if (!user) {
      const id = Math.random().toString(36).substring(2, 11);
      const now = new Date().toISOString();
      const insertSql = "INSERT INTO User (id, firstName, lastName, pin, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)";
      const insertArgs = [id, firstName, lastName, pin, now, now];

      if (isCloud) {
        await (db as any).execute({ sql: insertSql, args: insertArgs });
      } else {
        (db as any).prepare(insertSql).run(...insertArgs);
      }
      user = { id, firstName, lastName, pin };
    } else if (user.pin !== pin) {
      return { success: false, error: "PIN incorreto para este usuário." };
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_session", user.id, {
      httpOnly: true,
      secure: true, // Sempre secure em produção
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    console.error("ERRO NO LOGIN:", error.message || error);
    return { 
      success: false, 
      error: `Erro no Servidor: ${error.message || "Falha desconhecida no banco de dados."}` 
    };
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
    const sql = "SELECT * FROM User WHERE id = ?";
    
    if (isCloud) {
      const result = await (db as any).execute({ sql, args: [userId] });
      return result.rows[0];
    } else {
      return (db as any).prepare(sql).get(userId);
    }
  } catch (error) {
    return null;
  }
}

export async function seedActivities() {
  try {
    const db = await getDb();
    
    // Gerar 35 atividades dinamicamente para testar paginação
    const titles = ["Revisão de Código", "Atualização de Servidor", "Design de Nova Tela", "Correção de Bug", "Análise de Métricas", "Reunião de Alinhamento", "Otimização de Banco de Dados"];
    const priorities = ["BAIXA", "MEDIA", "ALTA", "CRITICA"];
    const categories = ["BUG", "FEATURE", "MELHORIA", "SUPORTE", "OPERACIONAL"];
    const statuses = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "BLOQUEADA"];
    const teams = ["Frontend", "Backend", "DevOps", "Design", "QA", "Produto"];
    const people = ["Ana Silva", "Bruno Costa", "Carla Souza", "Daniel Lima", "Eduardo Santos", "Fernanda Oliveira"];

    const now = new Date();

    for (let i = 1; i <= 35; i++) {
      const id = `seed-bulk-${i}`;
      const title = `${titles[i % titles.length]} #${i}`;
      const description = `Descrição detalhada gerada automaticamente para a demanda de número ${i} para testar a paginação e a renderização do sistema.`;
      const priority = priorities[i % priorities.length];
      const category = categories[i % categories.length];
      const status = statuses[i % statuses.length];
      const team = teams[i % teams.length];
      const person = people[i % people.length];
      
      // Datas variadas para testar a ordenação
      const createdAt = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)).toISOString(); 

      const sql = `
        INSERT OR REPLACE INTO Activity (id, title, description, priority, category, teamResponsible, personResponsible, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const args = [id, title, description, priority, category, team, person, status, createdAt, createdAt];
      
      if (isCloud) {
        await (db as any).execute({ sql, args });
      } else {
        (db as any).prepare(sql).run(...args);
      }
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro no seed:", error);
    return { success: false, error: "Falha ao gerar dados." };
  }
}

