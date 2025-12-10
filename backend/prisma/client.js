import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path'

// Ensure a single PrismaClient instance across hot-reloads in dev
const globalForPrisma = globalThis

// Ensure `DATABASE_URL` is set. For SQLite the env var should be:
// `file:../data/db/db.sqlite` (relative to `backend/prisma`). If the
// env var is missing, default to the repository's local DB path so
// PrismaClient can initialize without passing constructor overrides.
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:../data/db/db.sqlite'
}
const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL
})

let prisma = globalForPrisma.__prismaClient || new PrismaClient({
    log: ['error', 'warn'],
    adapter: adapter
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__prismaClient = prisma
}

export default prisma
