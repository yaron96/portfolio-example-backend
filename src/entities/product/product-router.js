import express from 'express'
import { CategoryRouter } from './category/category-router.js'
import { DraftRouter } from './draft/draft-router.js'
import { ProductController } from './product-contoroller.js'

export const ProductRouter = express.Router()

ProductRouter.use('/category', CategoryRouter);
ProductRouter.use('/draft', DraftRouter);

ProductRouter.get('/',
    ProductController.getMany)

ProductRouter.post('/',
    ProductController.create)

ProductRouter.put('/',
    ProductController.update)

ProductRouter.delete('/:id',
    ProductController.delete)