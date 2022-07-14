import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { AuthService } from './auth-service.js'
import { AuthError } from './auth-error.js'

function generateAccessToken(id, roles) {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, config.secret, {expiresIn: '24h'})
}

export class AuthController {

    static async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(AuthError.BadRequest('validation error', errors.array()))
            }
            const {email, password} = req.body
            const userData = await AuthService.registration(email, password)
            res.cookie(
                'refreshToken',
                userData.refreshToken,
                {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    static async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await AuthService.login(email, password)
            res.cookie(
                'refreshToken',
                userData.refreshToken,
                {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    static async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await AuthService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }


    static async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await AuthService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }

    static async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await AuthService.refresh(refreshToken)
            res.cookie(
                'refreshToken',
                userData.refreshToken,
                {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
}
