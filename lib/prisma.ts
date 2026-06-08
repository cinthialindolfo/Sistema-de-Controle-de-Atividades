import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

const prismaClientSingleton = () => {
    // Criamos a instância do banco
    const db = new Database('dev.db')

    // No Prisma 7, o adaptador espera que o objeto de banco tenha uma propriedade 'url'
    // para fins de identificação interna, embora o better-sqlite3 não a tenha nativamente.
    const adapter = new PrismaBetterSqlite3(Object.assign(db, { url: 'dev.db' }))

    return new PrismaClient({ adapter })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
