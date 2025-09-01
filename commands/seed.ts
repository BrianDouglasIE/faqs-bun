import { db } from "../db/db";
import { answers, projects, questions, users } from '../db/seeder';
import type { answers_table, project_users_table, projects_table, questions_table } from "../sqlite-table-defs";

if ((db.query(`SELECT COUNT(id) AS userCount FROM users;`).get() as any).userCount === 0) {
    const userInsert = db.prepare(`INSERT INTO users(email, password) VALUES ($name, $email);`);
    for (const { email, password } of users) {
        userInsert.run(email, password);
    }
}

if ((db.query(`SELECT COUNT(id) AS projectCount FROM projects;`).get() as any).projectCount === 0) {
    const projectInsert = db.prepare<projects_table, [string]>(`INSERT INTO projects(name) VALUES ($name) RETURNING *;`);
    const projectUserInsert = db.prepare<project_users_table, [number, number, string]>(`
    INSERT INTO project_users(project_id, user_id, role) VALUES ($project_id, $user_id, $role);
`);
    for (const { name, users } of projects) {
        const [project] = projectInsert.all(name);
        if (!project) continue;
        for (const user of users) {
            projectUserInsert.run(project.id, user.userId, user.role);
        }
    }
}

if ((db.query(`SELECT COUNT(id) AS qCount FROM questions;`).get() as any).qCount === 0) {
    const questionInsert = db.prepare<questions_table, [string, number, number]>(`
        INSERT INTO questions(text, project_id, user_id) VALUES ($text, $project_id, $user_id)
    `);
    for (const { text, projectId, userId } of questions) {
        questionInsert.run(text, projectId, userId);
    }
}

if ((db.query(`SELECT COUNT(id) AS aCount FROM answers;`).get() as any).aCount === 0) {
    const answerInsert = db.prepare<answers_table, [string, number, number]>(`
        INSERT INTO answers(text, question_id, user_id) VALUES ($text, $question_id, $user_id)
    `);
    for (const { text, questionId, userId } of answers) {
        answerInsert.run(text, questionId, userId);
    }
}
