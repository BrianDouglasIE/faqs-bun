import { db } from "../db/db";

export enum ProjectUserRole { EDITOR = 'EDITOR', READER = 'READER', OWNER = 'OWNER' }
export type ProjectUser = { id: number, email: string, role: ProjectUserRole }

export class Project {
    constructor(public id: number, public name: string, public created_at: Date) { }

    private users!: ProjectUser[]
    public getUsers(fromCache = true): ProjectUser[] {
        if (!fromCache || !this.users) {
            this.users = getProjectUsersStmt().all(this.id)
        }

        return this.users
    }
}

export class ProjectUserForm { constructor(public userId: number, public role: ProjectUserRole) { } }

export class ProjectForm {
    constructor(public name: string, public users: ProjectUserForm[]) { }
}

function getProjectUsersStmt() {
    return db.prepare<ProjectUser, [number]>(`
        SELECT u.id, u.email, pu.role
        FROM users u
        JOIN project_users pu ON pu.user_id = u.id
        JOIN projects p ON p.id = pu.project_id
        WHERE p.id = $1
    `)
}