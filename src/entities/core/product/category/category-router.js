import express from 'express'

import { CategoryController } from './category-controller.js'

export const CategoryRouter = express.Router()

CategoryRouter.get('/', CategoryController.getAll)
CategoryRouter.post('/', CategoryController.create)
CategoryRouter.delete('/:id', CategoryController.remove)
CategoryRouter.patch('/:id', CategoryController.update)