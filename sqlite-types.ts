import { writeFileSync } from "node:fs";
import { db } from "./db/db";
import { join } from "node:path";

const sqliteToTsType: Record<string, string> = {
    // numeric
    "INT": "number",
    "INTEGER": "number",
    "TINYINT": "number",
    "SMALLINT": "number",
    "MEDIUMINT": "number",
    "BIGINT": "number",
    "UNSIGNED BIG INT": "number",
    "INT2": "number",
    "INT8": "number",

    // real
    "REAL": "number",
    "DOUBLE": "number",
    "DOUBLE PRECISION": "number",
    "FLOAT": "number",
    "NUMERIC": "number",
    "DECIMAL": "number",

    // text
    "TEXT": "string",
    "CHARACTER": "string",
    "VARCHAR": "string",
    "VARYING CHARACTER": "string",
    "NCHAR": "string",
    "NATIVE CHARACTER": "string",
    "NVARCHAR": "string",
    "CLOB": "string",

    // date/time
    "DATE": "string",
    "DATETIME": "string",

    // blob
    "BLOB": "Buffer",

    // null
    "NULL": "null",
};

function mapSqliteTypeToTs(type: string): string {
    const normalized = type.trim().toUpperCase();
    for (const key in sqliteToTsType) {
        if (normalized.includes(key)) {
            return sqliteToTsType[key] ?? 'any';
        }
    }
    return "any";
}

export function generateSqliteTableDefinitions() {
    let content = '/* GENERATED FILE CONTENT DO NOT EDIT */\n\n'
    const tables = db.query<{ name: string }, []>(`SELECT name FROM sqlite_master WHERE type='table';`).all()

    for (const table of tables) {
        const stmt = db.prepare<{ name: string, type: string, }, []>(`PRAGMA table_info(${table.name})`);
        const columns = stmt.all();
        content += `export type ${table.name}_table = { \n${columns.map(it => `  ${it.name}: ${mapSqliteTypeToTs(it.type)}`).join(';\n')}\n}\n\n`
    }

    writeFileSync(join(process.cwd(), 'sqlite-table-defs.ts'), content, 'utf8')
}
