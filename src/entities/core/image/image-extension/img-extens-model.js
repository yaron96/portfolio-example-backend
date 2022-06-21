import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ImgExtensSchema = new Schema({
    value: {
        type: String,
        required: true,
        unique: true
    },
    mimetype: {
        type: String,
        required: true
    }
})

export const ImageExtensionModel = mongoose.model('image-extension', ImgExtensSchema)
