'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Busca todas as atividades no banco de dados.
 * Ordenação: Da mais recente para a mais antiga.
 */
export async function getActivities() {
    try {
        const activities = await prisma.activity.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return { success: true, data: activities };
    } catch (error) {
        console.error("Erro ao buscar atividades:", error);
        return { success: false, error: "Falha ao carregar atividades." };
    }
}

/**
 * Cria uma nova atividade no banco de dados.
 * @param formData Dados vindos do formulário.
 */
export async function createActivity(formData: FormData) {
    try {
        // Extração e validação básica dos dados do FormData
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const priority = formData.get("priority") as string;
        const category = formData.get("category") as string;
        const teamResponsible = formData.get("teamResponsible") as string;
        const personResponsible = formData.get("personResponsible") as string;
        const status = formData.get("status") as string || "PENDENTE";

        // Validação de campos obrigatórios conforme SDD
        if (!title || !description || !priority || !category || !teamResponsible || !personResponsible) {
            return { success: false, error: "Todos os campos obrigatórios devem ser preenchidos." };
        }

        const newActivity = await prisma.activity.create({
            data: {
                title,
                description,
                priority,
                category,
                teamResponsible,
                personResponsible,
                status,
            },
        });

        // Invalida o cache da página principal para refletir a nova atividade
        revalidatePath("/");

        return { success: true, data: newActivity };
    } catch (error) {
        console.error("Erro ao criar atividade:", error);
        return { success: false, error: "Falha ao registrar a atividade no banco de dados." };
    }
}

/**
 * Atualiza o status de uma atividade (Exemplo de função adicional útil)
 */
export async function updateActivityStatus(id: string, status: string) {
    try {
        await prisma.activity.update({
            where: { id },
            data: { status },
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return { success: false, error: "Falha ao atualizar o status." };
    }
}

/**
 * Exclui uma atividade
 */
export async function deleteActivity(id: string) {
    try {
        await prisma.activity.delete({
            where: { id },
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erro ao excluir atividade:", error);
        return { success: false, error: "Falha ao excluir a atividade." };
    }
}
