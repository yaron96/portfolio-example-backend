import { AuthError } from '../exceptions/auth-error.js'

export const ErrorMiddleware = function (err, req, res, next) {
    console.log('errormiddleware')
    console.log(err)
    if (err instanceof AuthError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: 'unexpected error'})
}
