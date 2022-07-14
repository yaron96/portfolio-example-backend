import express from 'express'
import multer from 'multer'
import { DraftController } from './draft-controller.js'

const upload = multer({ dest: 'files/temp' }) // TODO check exists dest path

export const DraftRouter = express.Router()

DraftRouter.post(
    "/",
    DraftController.create
);

DraftRouter.put(
    "/:id",
    DraftController.update
);

DraftRouter.put(
    "/:id/images",
    DraftController.imagesSort
);

DraftRouter.post(
    "/:id/images",
    upload.array("files"),
    DraftController.imagesUpload
);

DraftRouter.delete(
    "/:id/images/:imgId",
    DraftController.imageDelete
);