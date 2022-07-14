import express from 'express'
import { body } from 'express-validator'
import { AuthController } from './auth-controller.js'
import { AuthMiddleware } from './auth-middleware.js'

export const AuthRouter = express.Router()

AuthRouter.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    AuthController.registration
)

AuthRouter.post('/login',
    AuthController.login
)

AuthRouter.post('/logout',
    AuthController.logout
)

AuthRouter.get('/activate/:link',
    AuthController.activate
)

AuthRouter.get('/refresh',
    AuthController.refresh
)