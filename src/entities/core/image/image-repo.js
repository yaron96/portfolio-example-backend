import { ImageModel } from './image-model.js'

export const ImageRepo = {
    create: async (extension) => {
        const model = await ImageModel.create({ extension })
        return model
    },
    getOneById: async (id) => {
        const model = await ImageModel.findById(id).populate('extension')
        return model
    },
    update: async (id, update) => {
        const updated = await ImageModel.findByIdAndUpdate(id, update)
        return updated
    },
    delete: async (id) => {
        return await ImageModel.findByIdAndDelete(id)
    }
}
