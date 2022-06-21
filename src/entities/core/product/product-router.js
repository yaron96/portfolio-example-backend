import express from 'express'
import multer from 'multer'

import { ProductController } from './product-contoroller.js'

const upload = multer({ dest: 'files/temp' }) // TODO check exists dest path

export const ProductRouter = express.Router()

ProductRouter.get('/',
    ProductController.getMany)

ProductRouter.post('/',
    ProductController.create)

ProductRouter.patch('/',
    ProductController.update)

ProductRouter.delete('/:id',
    ProductController.delete)

//draft
ProductRouter.post('/draft',
    ProductController.createDraft)



ProductRouter.post('/draft/update',
    ProductController.draftUpdate)

ProductRouter.post('/draft/images/sort/:draft_id',
    ProductController.draftImagesSort)

ProductRouter.post('/draft/images/upload/:draft_id', upload.array('files'),
    ProductController.draftImagesUpload)

ProductRouter.post('/draft/images/delete/:draft_id/:image_id',
    ProductController.draftImagesDelete)
