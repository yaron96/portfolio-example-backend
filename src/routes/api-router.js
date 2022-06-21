import express from 'express'
import { body } from 'express-validator'

import { ApiController } from '../controllers/api-controller.js'

export const ApiRouter = express.Router()

ApiRouter.get('/products', ApiController.find)
