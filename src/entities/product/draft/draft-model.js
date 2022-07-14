import mongoose from "mongoose"
import { ProductModel } from "../product-model.js";

const Schema = mongoose.Schema;

const DraftSchema = ProductModel.schema
    .clone(() => res)
    .add({productId: {type: Schema.Types.ObjectId, req: 'product'}})

export const DraftModel = mongoose.model('product-draft', DraftSchema);