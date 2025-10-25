import { PrismaClient } from '@prisma/client'

// Ensure a single PrismaClient instance across hot-reloads in dev
const globalForPrisma = globalThis

let prisma = globalForPrisma.__prismaClient || new PrismaClient({
    log: ['error', 'warn']
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__prismaClient = prisma
}

export default prisma
