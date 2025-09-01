import { db } from '../db/db'
import { migrations } from '../db/migrations'
import { generateSqliteTableDefinitions } from '../sqlite-types'

db.run(`
CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

const insertMigration = db.prepare(`INSERT INTO migrations(name) VALUES ($name)`)
const searchMigrations = db.query(`SELECT id FROM migrations WHERE name = ?1`)
for (const { name, sql } of migrations) {
    if (!searchMigrations.all(name).length) {
        console.log(`- ${name}`);
        db.run(sql);
        insertMigration.run(name)
    }
}

generateSqliteTableDefinitions()