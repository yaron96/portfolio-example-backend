import CityModel from '../models/delivery/city-model.js'

const delay = {
    value: 0,
    func: async () => {
        setTimeout(() => {
            // empty func
        }, delay.value)
    }
}

const CityController = {
    create: async (city) => await CityModel.create(city),
    deleteAll: async () => await CityModel.deleteMany({}),
    find: async (filter) => {
        if (delay.value !== 0) {
            await delay.func()
        }
        const err = {}
        const cities = await CityModel.find(filter, function (err, res) {
            if (!err) {
                return res
            }
        }).clone().catch(function (e) {
            err.code = e.code
            err.full = e
        })
        if (err.code) {
            if (err.code === 50737) {
                delay.value += 1
                return CityController.find(filter)

            } else {
                throw err
            }
        } else {
            if (delay.value !== 0) delay.value = 0
            return cities
        }
    },
    findOne: async (filter) => await CityModel.findOne(filter),
    findOneAndDelete: async (filter) => await CityModel.findOneAndDelete(filter),
    findOneAndUpdate: async (filter, update) => await CityModel.findOneAndUpdate(filter, update),
    schemaTree: async () => Object.keys(CityModel.schema.tree),
}

export {CityController as default}