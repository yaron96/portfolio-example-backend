import express from 'express'
import { body } from 'express-validator'
import { AuthController } from './auth-controller.js'
import { AuthMiddleware } from '../../../middleware/auth-middleware.js'

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

AuthRouter.get('/users',
    AuthMiddleware,
    AuthController.getUsers
)

//AuthRouter.get('/users', authMiddleware, authController.getUsers)
//AuthRouter.get('/users', roleMiddleware(['admin']), authController.getUsers)

