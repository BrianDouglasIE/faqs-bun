import { Project } from "./models/project";
import { db } from "./db/db";
import type { projects_table } from "./sqlite-table-defs";

import { Hono } from 'hono'

const projects = new Hono().basePath('/projects')
projects.get('/', (c) => {
    const rawProjects = db.query<projects_table, []>('SELECT * FROM projects LIMIT 10;').all()
    const projects = rawProjects.map(it => new Project(it.id, it.name, new Date(it.created_at)))
    return c.json(projects)
})

const app = new Hono()
app.route('/', projects)
app.get('/', (c) => c.text('Hello Bun!'))


export default app