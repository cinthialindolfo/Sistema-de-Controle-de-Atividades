'use server'

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { prisma } from "../lib/prisma";

export async function getActivities(filters?: any) {
  try {
    const where: any = {};

    if (filters?.search) {
      where.title = { contains: filters.search };
    }
    if (filters?.priority && filters.priority !== "all") {
      where.priority = filters.priority;
    }
    if (filters?.status && filters.status !== "all") {
      where.status = filters.status;
    }
    if (filters?.category && filters.category !== "all") {
      where.category = filters.category;
    }
    if (filters?.teamResponsible) {
      where.teamResponsible = { contains: filters.teamResponsible };
    }
    if (filters?.personResponsible) {
      where.personResponsible = { contains: filters.personResponsible };
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: activities };
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return { success: false, error: "Falha ao carregar atividades" };
  }
}

export async function createActivity(formData: FormData) {
  try {
    const newActivity = await prisma.activity.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        priority: formData.get("priority") as string,
        category: formData.get("category") as string,
        teamResponsible: formData.get("teamResponsible") as string,
        personResponsible: formData.get("personResponsible") as string,
        status: "PENDENTE",
      },
    });

    revalidatePath("/");
    return { success: true, data: newActivity };
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    return { success: false, error: "Falha ao criar atividade" };
  }
}

export async function updateActivity(id: string, formData: FormData) {
  try {
    await prisma.activity.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        priority: formData.get("priority") as string,
        category: formData.get("category") as string,
        teamResponsible: formData.get("teamResponsible") as string,
        personResponsible: formData.get("personResponsible") as string,
        status: formData.get("status") as string,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    return { success: false, error: "Falha ao atualizar atividade" };
  }
}

export async function deleteActivity(id: string) {
  try {
    await prisma.activity.delete({
      where: { id },
    });

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

  console.log('Tentativa de login:', { firstName, lastName, pinLength: pin?.length });

  if (!firstName || !lastName || !pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
    return { success: false, error: "Preencha Nome, Sobrenome e PIN de 4 dígitos." };
  }

  try {
    console.log('Buscando usuário no Prisma...');
    let user = await prisma.user.findUnique({
      where: {
        firstName_lastName: {
          firstName,
          lastName,
        },
      },
    });

    if (!user) {
      console.log('Usuário não encontrado, criando novo...');
      // Auto-registro no primeiro login
      user = await prisma.user.create({
        data: { firstName, lastName, pin },
      });
      console.log('Usuário criado com ID:', user.id);
    } else if (user.pin !== pin) {
      console.log('PIN incorreto para o usuário.');
      return { success: false, error: "PIN incorreto para este usuário." };
    }

    console.log('Login bem-sucedido, configurando cookie...');
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    console.error("Erro detalhado no login:", error);
    console.error("Mensagem do erro:", error.message);
    console.error("Stack do erro:", error.stack);
    return { success: false, error: `Erro no servidor: ${error.message || 'Erro desconhecido'}` };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  revalidatePath("/");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;

  if (!userId) return null;

  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (error) {
    return null;
  }
}

