import { db } from "../db/db";

export enum ProjectUserRole { EDITOR = 'EDITOR', READER = 'READER', OWNER = 'OWNER' }
export type ProjectUser = { id: number, email: string, role: ProjectUserRole }

export class Project {
    constructor(public id: number, public name: string, public created_at: Date) { }

    private getUsersStatement = db.prepare<ProjectUser, [number]>(`
SELECT u.id, u.email, pu.role
FROM users u
JOIN project_users pu ON pu.user_id = u.id
JOIN projects p ON p.id = pu.project_id
WHERE p.id = $1
`)

    public getUsers(): ProjectUser[] {
        return this.getUsersStatement.all(this.id)
    }
}

export class ProjectUserForm { constructor(public userId: number, public role: ProjectUserRole) { } }

export class ProjectForm {
    constructor(public name: string, public users: ProjectUserForm[]) { }
}
