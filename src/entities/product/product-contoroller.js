import { ProductService } from './product-service.js'

export const ProductController = {
    getMany: async (req, res) => {
        const query = req.query
        const { data, meta } = await ProductService.getMany(query)
        return res.json({ data, meta })
    },

    create: async (req, res) => {
        const { draftId } = req.body
        const created = await ProductService.create(draftId)
        return res.json(created)
    },
    read: async (req, res) => {
        const product = await ProductService.read(req.params.id)
        return res.json(product)
    },
    getProps: async (req, res) => {
        const { id } = req.params
        const propNames = req.body
        const result = await ProductService.getProperties(id, propNames)
        return res.json(result)
    },
    update: async (req, res) => {
        const { draftId }  = req.body
        const updated = await ProductService.update(draftId)
        return res.json(updated)
    },
    delete: async (req, res) => {
        const { product_id } = req.params
        await ProductService.delete(product_id)
        return res.send().status(200)
    },
}

//products/list?page=1&name='dsadsa'&