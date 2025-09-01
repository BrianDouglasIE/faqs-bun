import { Project } from "./models/project";
import { db } from "./db/db";
import type { projects_table } from "./sqlite-table-defs";

const projectRaw = db.query<projects_table, []>('SELECT * FROM projects WHERE id = 1').get()
if (projectRaw) {
    const project = new Project(projectRaw.id, projectRaw.name, new Date(projectRaw.created_at))
    console.log(project.getUsers());
}
