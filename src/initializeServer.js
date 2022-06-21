import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { AuthRouter } from './entities/extra/auth/auth-router.js'
import { ImageRouter } from './entities/core/image/image-router.js'
import { ProductRouter } from './entities/core/product/product-router.js'
import { CategoryRouter } from './entities/core//product/category/category-router.js'
import { ErrorMiddleware } from './middleware/error-middleware.js'

import dotenv from 'dotenv'
dotenv.config()

export function initializeServer() {
    const app = express()

    app.use(bodyParser.json())
    app.use(cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    }))
    app.use(cookieParser())

    app.use('/auth', AuthRouter)
    app.use('/product', ProductRouter)
    app.use('/image', ImageRouter)
    app.use('/category', CategoryRouter)

    app.use(ErrorMiddleware)

    return app
}
