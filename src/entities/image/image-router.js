import express from 'express'

import { ImageController } from './image-controller.js'

export const ImageRouter = express.Router()

ImageRouter.get('/:id', ImageController.getOneByUrl)
ImageRouter.get('/thumb/:id', ImageController.getOneThumbByUrl)
