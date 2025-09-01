export class User {
    constructor(public email: string, public created_at: Date) { }
}

export class UserForm {
    constructor(public email: string, public password: string) { }
}