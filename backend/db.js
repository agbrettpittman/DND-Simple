import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

// Load env once here in case consumers didn't
dotenv.config()

// Resolve DB file path with override, default "db.sqlite" in project root/backend/data
const DBFileName = process.env.DB_FILE || 'db.sqlite'
const DBDir = path.resolve(process.cwd(), 'data', 'db')
const DBPath = path.resolve(DBDir, DBFileName)

// Ensure data directory exists
if (!fs.existsSync(DBDir)) {
    fs.mkdirSync(DBDir, { recursive: true })
}

// Open database with sane defaults (WAL for better concurrency)
const db = new Database(DBPath)
db.pragma('journal_mode = WAL')

// Initialize schema if not exists
const initSql = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Update updated_at only when name or email change to avoid recursive trigger
CREATE TRIGGER IF NOT EXISTS users_updated_at
AFTER UPDATE OF name, email ON users
FOR EACH ROW
BEGIN
  UPDATE users SET updated_at = datetime('now') WHERE id = OLD.id;
END;
`

db.exec(initSql)

export default db
export { DBPath }
