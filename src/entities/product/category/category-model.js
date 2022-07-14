import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'category',
        validate: (val) => mongoose.isValidObjectId(val)
    }],
    // parrent: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'category',
    //     required: true,
    //     validate: (val) => mongoose.isValidObjectId(val)
    // }
})

export const CategoryModel = mongoose.model('category', CategorySchema)