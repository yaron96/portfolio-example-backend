import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ImageSchema = new Schema({
    extension: {
        type: Schema.Types.ObjectId, ref: 'image-extension'
    },
    owners: [{
        type: Schema.Types.ObjectId
    }]
})

export const ImageModel = mongoose.model('image', ImageSchema)
