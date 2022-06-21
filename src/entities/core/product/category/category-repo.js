import { CategoryModel } from './category-model.js'

const ROOT_ID = '622f1b64ffb25fd1ecac1ad7'

export const CategoryRepo = {

    getAll: async () => {
        const all = await CategoryModel.find()
        return all
    },

    getOneById: async (id) => {
        const found = await CategoryModel.findById(id)
        return found
    },

    getOneByFilter: async (filter) => {
        const result = await CategoryModel.findOne(filter)
        return result
    },

    create: async (title, parrentId = ROOT_ID ) => {
        const created = await CategoryModel.create({title})
        await CategoryModel.findByIdAndUpdate(parrentId, {
            $push: { children: created },
        });

        return created
    },

    remove: async (id) => {
        const removed = await CategoryModel.findByIdAndDelete(id)
        return removed
    },

    update: async (id, update) => {
        const result = await CategoryModel.findByIdAndUpdate(id, update)
        return result
    },





    getRootNode: async () => {
        const rootNode = await CategoryModel.findOne({ title: 'root' })
        return rootNode
    },

    

    

    findParrent: async (id) => {
        const result = await CategoryModel.findOne({ children: id })
        return result
    },

    deleteChild: async (childId) => {
        const result = await CategoryModel.findOneAndUpdate(
            { children: childId },
            {
                $pull: {
                    children: childId
                }
            }
        )
        console.log(result)
        return result
    },

    addChild: async (parrentId, childId) => {
        const result = await CategoryModel.findByIdAndUpdate(parrentId,
            {
                $push: {
                    children: childId
                }
            }
        )
        console.log(result)
        return result
    }

}
