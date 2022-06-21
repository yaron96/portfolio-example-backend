import UpdateModel from '../models/update-model.js'

const UpdateController = {
    create: async (date) => await UpdateModel.create(date),
    find: async () => await UpdateModel.findOne({}),
    findOneAndUpdate: async (update) => await UpdateModel.findOneAndUpdate({}, update),
}

export {UpdateController as default}
