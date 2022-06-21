export class AuthError extends Error {
    status
    errors

    constructor(status, message, errors) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError() {
        return new AuthError(401, 'user is not authorized')
    }

    static BadRequest(message, errors = []) {
        return new AuthError(400, message, errors)
    }
}


