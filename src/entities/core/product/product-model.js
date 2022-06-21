import mongoose from 'mongoose'

const Schema = mongoose.Schema

const productProps = {
    title: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },
    images: [{
            type: Schema.Types.ObjectId,
            ref: 'image'
    }],
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    cabins: {
        type: Number
    },
    berth: {
        type: Number
    },
    yearbuilt: {
        type: Number,
    },
    used: {
        type: Boolean,
    },
    length: {
        type: mongoose.Types.Decimal128,
    },
    beam: {
        type: mongoose.Types.Decimal128,
    },
}

const ProductSchema = new Schema(productProps, {timestamps: true})
const EditableProductSchema = ProductSchema
    .clone(() => res)
    .add({productId: {type: Schema.Types.ObjectId, req: 'product'}})

export const ProductModel = mongoose.model('product', ProductSchema)
export const DraftModel = mongoose.model('product-draft', EditableProductSchema)
