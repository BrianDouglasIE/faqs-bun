import { Project } from "./models/project";
import { db } from "./db/db";
import type { projects_table } from "./sqlite-table-defs";

const rawProjects = db.query<projects_table, []>('SELECT * FROM projects LIMIT 10;').all()
for (const rawProject of rawProjects) {
    const project = new Project(rawProject.id, rawProject.name, new Date(rawProject.created_at))
    console.log(project.name)
    console.log(project.getUsers())
}
