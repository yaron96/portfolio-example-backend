import { ProductModel, DraftModel } from './product-model.js'

export class ProductRepo {

    static async create (newProduct) {
        const product = await ProductModel.create(newProduct)
        return product
    }

    static async getOneById (id) {
        const product = await ProductModel.findById(id)
        return product
    }

    static async getMany (
        filter,
        take = 0,
        page = 1,
        sort = 1
        ) {

        const totalCount = await ProductModel.count()
        const skip = take * (page - 1)
        const result = await ProductModel
            .find(filter)
            .sort('title')
            .skip(skip)
            .limit(take)

        return { result, totalCount }
    }

    static async update (id, update, returnNew = true) {
        const product = await ProductModel.findByIdAndUpdate(id, update, {new: returnNew})
        return product
    }

    static async delete (id)  {
        const deleted = await ProductModel.findByIdAndDelete(id)
        return deleted
    }
}

export class DraftRepo {

    static async create(props) {
        const created = await DraftModel.create(props)
        return created
    }

    static async getById(id) {
        const found = await DraftModel.findById(id)
        return found
    }

    static async update(id, update, returnNew = true) {
        const updated = await DraftModel.findByIdAndUpdate(id, update, {new: returnNew})
        return updated
    }

    static async delete(id) {
        const deleted = await DraftModel.findByIdAndDelete(id)
        return deleted
    }
}
