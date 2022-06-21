import { ProductService, DraftService } from './product-service.js'

export const ProductController = {
    getMany: async (req, res) => {
        console.log(req.query)
        const { take, page } = req.query
        const { data, meta } = await ProductService.getMany()
        return res.json({ data, meta })
    },
    createDraft: async (req, res) => {
        const { product_id } = req.body
        const draft = await DraftService.create(product_id)
        return res.json(draft)
    },
    create: async (req, res) => {
        const { draft_id } = req.params
        const product = await ProductService.create(draft_id)
        return res.json(product)
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
        const draft  = req.body
        const updated = await ProductService.update(draft)
        return res.json(updated)
    },
    delete: async (req, res) => {
        const { product_id } = req.params
        await ProductService.delete(product_id)
        return res.send().status(200)
    },

    draftUpdate: async (req, res) => {
        const draft = req.body
        const updated = await DraftService.update(draft)
        return res.json(updated)
    },
    draftImagesUpload: async (req, res) => {
        const { draft_id } = req.params
        const imageFiles = req.files
        const result = await DraftService.imagesAdd(draft_id, imageFiles)
        res.json(result)
    },
    draftImagesSort: async (req, res) => {
        const { draft_id } = req.params
        const sorted = req.body
        const updatedLinks = await DraftService.imagesSort(draft_id, sorted)
        return res.json(updatedLinks)
    },
    draftImagesDelete: async (req, res) => {
        const { draft_id, image_id } = req.params
        const deletedLink = await DraftService.imagesDelete(draft_id, image_id)
        return res.json(deletedLink)
    },
}
