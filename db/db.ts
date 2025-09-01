import { Database } from "bun:sqlite";
import { join } from "node:path";
import { existsSync, writeFileSync } from "node:fs";

const dbFile = join(process.cwd(), "db.sqlite")
if (!existsSync(dbFile)) writeFileSync(dbFile, '')

export const db = new Database(dbFile);

db.run(`
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys = ON;
`)
