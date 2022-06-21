import { ImageExtensionModel } from './img-extens-model.js'

export const ImageExtensionRepo = {
    create: async (imgExtens) => {
        const newImgExtens = await ImageExtensionModel.create(imgExtens)
        return newImgExtens
    },
    findOne: async (filter) => {
        const extens = await ImageExtensionModel.findOne(filter)
        return extens
    },
    findAll: async () => {
        const result = await ImageExtensionModel.find()
        return result 
    }
    // delete: {}
}
