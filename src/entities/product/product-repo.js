import { ProductModel } from './product-model.js'

export class ProductRepo {

    static async create (newProduct) {
        const created = await ProductModel.create(newProduct)
        return dto(created)
    }

    static async getOneById (id) {
        const product = await ProductModel.findById(id)
        return dto(product)
    }

    static async getMany (
        filter,
        take = 0,
        page = 1,
        sort = 'updatedAt'
        ) {
            
        const totalCount = await ProductModel.count()
        const skip = take * (page - 1)

        const data = await ProductModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(take * 1)
            .then((arr) => arr.map((e) => dto(e)))

        return { data, totalCount }
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



function dto(product) {
    return {
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images.map((e) => e._id.toString())
    }
}