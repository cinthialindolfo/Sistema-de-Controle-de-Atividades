import { PrismaClient } from '@prisma/client'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
const prisma = new PrismaClient({
    datasourceUrl: `file:${dbPath}`
})

async function main() {
    try {
        console.log('Buscando atividades...')
        const activities = await prisma.activity.findMany()
        console.log('Atividades encontradas:', activities.length)
        
        console.log('Criando atividade de teste...')
        const newActivity = await prisma.activity.create({
            data: {
                title: 'Teste',
                description: 'Descrição de teste',
                priority: 'BAIXA',
                category: 'MELHORIA',
                teamResponsible: 'QA',
                personResponsible: 'Tester',
                status: 'PENDENTE'
            }
        })
        console.log('Atividade criada com sucesso:', newActivity.id)
    } catch (e) {
        console.error('Erro no teste:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
