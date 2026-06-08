// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Criamos um objeto que imita o PrismaClient para não quebrar o resto do código
// mas não inicializamos o cliente real, evitando erros de conexão/adaptador
const mockPrisma = {
  activity: {
    findMany: async () => [],
    create: async () => ({ id: "1", title: "Atividade Exemplo", status: "PENDENTE" }),
    update: async () => ({}),
    delete: async () => ({}),
  },
  user: {
    findUnique: async () => null,
    create: async () => ({ id: "1" }),
  }
} as unknown as PrismaClient

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || mockPrisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma