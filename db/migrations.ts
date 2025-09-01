export type Migration = { name: string, sql: string }

export const migrations: Migration[] = [
    {
        name: 'create users table',
        sql: `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
        `
    },
    {
        name: 'create projects table',
        sql: `
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(60) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);  
        `
    },
    {
        name: 'create project_users table',
        sql: `
CREATE TABLE IF NOT EXISTS project_users (
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('READER', 'EDITOR', 'OWNER')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);  
        `
    },
    {
        name: 'create questions table',
        sql: `
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text text NOT NULL,
    project_id INTEGER NOT NULL,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
        `
    },
    {
        name: 'create answers table',
        sql: `
CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text text NOT NULL,
    question_id INTEGER NOT NULL,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
        `
    }
];
