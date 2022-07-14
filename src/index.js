import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { initializeServer } from './initializeServer.js'

dotenv.config()

mongoose.Promise = global.Promise

try {
    mongoose.connect(process.env.DB_URL)
    console.log(`Mongoose - successful connection ...`)
} catch (e) {
    console.log(e)
}

const app = initializeServer()
const PORT = process.env.PORT || 8081

app.listen(PORT, () => console.log(`Server start on port ${PORT} ...`))