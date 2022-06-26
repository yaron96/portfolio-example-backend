import { CategoryModel } from "./category-model.js";

const ROOT_ID = "622f1b64ffb25fd1ecac1ad7";

export const CategoryRepo = {
    getAll: async () => {
        const all = await CategoryModel.find();
        return all;
    },

    getOneById: async (id) => {
        const found = await CategoryModel.findById(id);
        return found;
    },

    getOneByFilter: async (filter) => {
        const result = await CategoryModel.findOne(filter);
        return result;
    },

    create: async (title, parrentId = ROOT_ID) => {
        const created = await CategoryModel.create({ title });
        await CategoryModel.findByIdAndUpdate(parrentId, {
            $push: { children: created },
        });
        return created;
    },

    remove: async (id) => {
        const removed = await CategoryModel.findByIdAndDelete(id);
        return removed;
    },

    update: async (id, update) => {
        const result = await CategoryModel.findByIdAndUpdate(id, update, {
            new: true,
        });
        return result;
    },
};