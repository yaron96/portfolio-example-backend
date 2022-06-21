import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CategorySchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'category',
        validate: (val) => {
            return mongoose.isValidObjectId(val)
        }
    }]
})

export const CategoryModel = mongoose.model('category', CategorySchema)
