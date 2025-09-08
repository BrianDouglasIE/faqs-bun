export class User {
    constructor(public email: string, public created_at: Date) { }
}

export class UserForm {
    [key: string]: string;

    constructor();
    constructor(email: string, password: string);

    constructor(public email: string = '', public password: string = '', public confirmPassword: string = '') { }

    public static fromFormData(formData: FormData) {
        const instance = new UserForm()

        for (const [key, value] of formData.entries()) {
            if (Object.hasOwn(instance, key)) instance[key] = value
        }

        return instance
    }
}
