import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path'
import { fileURLToPath } from 'url'

// Ensure a single PrismaClient instance across hot-reloads in dev
const globalForPrisma = globalThis

// Ensure `DATABASE_URL` is set. For SQLite the env var should be:
// `file:../data/db/db.sqlite` (relative to the `backend/` root). If the
// env var is missing, default to the repository's local DB path so
// PrismaClient can initialize without passing constructor overrides.
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./data/db/db.sqlite'
}

// If the DATABASE_URL is a sqlite file URL and the path portion is
// relative, interpret it as relative to the backend root and rewrite
// it to an absolute path. This works in ESM by deriving `__dirname`.
{
    const raw = process.env.DATABASE_URL || ''
    if (raw.startsWith('file:')) {
        const filePath = raw.slice('file:'.length)
        // If the path is not already absolute, resolve it relative to
        // the backend directory (one level up from `prisma/`).
        if (!path.isAbsolute(filePath)) {
            const __filename = fileURLToPath(import.meta.url)
            const __dirname = path.dirname(__filename)
            const backendRoot = path.resolve(__dirname, '..')
            const absolutePath = path.resolve(backendRoot, filePath)
            process.env.DATABASE_URL = 'file:' + absolutePath
        }
    }
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
