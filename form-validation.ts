type ErrorMap = { [key: string]: string[] }
type ErrorMessageCallback = (input: string) => string
type ValidatorMap = { [key: string]: Function[] }
type Validated<T> = { input: T, errors: ErrorMap, hasErrors: boolean }

export const createFieldValidator = <T extends Object>(validators: ValidatorMap) => (input: T): Validated<T> => {
    const errors: ErrorMap = {}
    let hasErrors = false
    for (const [key, value] of Object.entries(input)) {
        if (validators[key]) {
            for (const validator of validators[key]) {
                const error = validator(value)
                if (error) {
                    hasErrors = true
                    if (errors[key]) {
                        errors[key].push(error)
                    } else {
                        errors[key] = [error]
                    }
                }
            }
        }
    }

    return { input, errors, hasErrors }
}

export const stringValidators = {
    isString: (msg?: ErrorMessageCallback) => (input: string) => {
        if (!(typeof input == 'string')) return msg ? msg(input) : 'Not a string'
    },
    min: (n: number, msg?: ErrorMessageCallback) => (input: string) => {
        if (input.length < n) return msg ? msg(input) : `Must be greater than ${n} characters in length`
    },
    max: (n: number, msg?: ErrorMessageCallback) => (input: string) => {
        if (input.length > n) return msg ? msg(input) : `Must be less than ${n} characters in length`
    },
    email: (msg?: ErrorMessageCallback) => (input: string) => {
        const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!emailRe.test(input.toLowerCase())) return msg ? msg(input) : 'Not a valid email address'
    }
}