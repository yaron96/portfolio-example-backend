import mongoose from 'mongoose'

const Schema = mongoose.Schema

const DataSchema = new Schema({
    Ref: {
        type: String,
        unique: true
    },
    DescriptionRu: {
        type: String
    },
    Description: {
        type: String
    },
    Cities: [{
        type: Schema.Types.ObjectId,
        ref: 'city'
    }]
})

const AreaModel = mongoose.model('area', DataSchema)

export {AreaModel as default}