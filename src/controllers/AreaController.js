import AreaModel from '../models/delivery/area-model.js'

const AreaController = {
    create: async (area) => await AreaModel.create(area),
    deleteAll: async () => await AreaModel.deleteMany({}),
    find: async (filter) => await AreaModel.find(filter),
    findOne: async (filter) => await AreaModel.findOne(filter),
    findOneAndUpdate: async (filter, update) => await AreaModel.findOneAndUpdate(filter, update),
    findOneAndDelete: async (filter) => await AreaModel.findOneAndDelete(filter),
    getOneWithCities: async (filter) => await AreaModel.findOne(filter).populate('Cities'),
    schemaTree: async () => Object.keys(AreaModel.schema.tree)
}

export {AreaController as default}