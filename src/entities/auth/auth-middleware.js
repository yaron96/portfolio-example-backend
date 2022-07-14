import { AuthError } from "./auth-error.js"
import { TokenService } from './token/token-service.js'

export function AuthMiddleware(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            return next(AuthError.UnauthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) {
            return next(AuthError.UnauthorizedError())
        }

        const userData = TokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(AuthError.UnauthorizedError())
        }
        req.user = userData
        next()
    } catch (e) {
        return next(AuthError.UnauthorizedError())
    }
}




