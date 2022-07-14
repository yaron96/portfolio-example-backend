import express from 'express'
import { UserController } from './user-controller.js'

export const UserRouter = express.Router()

UserRouter.get('/me', UserController.me)