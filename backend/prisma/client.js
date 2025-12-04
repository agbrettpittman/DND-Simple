import { PrismaClient } from '@prisma/client'

// Ensure a single PrismaClient instance across hot-reloads in dev
const globalForPrisma = globalThis

// Provide the database connection via the `adapter` option so the
// datasource `url` is not required inside `schema.prisma`.
// For SQLite the DATABASE_URL env var should be like: `file:../data/db/db.sqlite`
let prisma = globalForPrisma.__prismaClient || new PrismaClient({
    adapter: { url: process.env.DATABASE_URL },
    log: ['error', 'warn']
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__prismaClient = prisma
}

export default prisma
