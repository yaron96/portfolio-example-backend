import { CategoryModel } from "./category-model.js";

export const ROOT_ID = "622f1b64ffb25fd1ecac1ad7";

export const CategoryRepo = {
    getAll: async () => {
        const all = await CategoryModel.find();
        return all.map(e => dto(e));
    },

    getOneById: async (id) => {
        const found = await CategoryModel.findById(id);
        return dto(found);
    },

    getOneByFilter: async (filter) => {
        const found = await CategoryModel.findOne(filter);
        return dto(found);
    },

    create: async (title, parrent = ROOT_ID) => {
        const created = await CategoryModel.create({ title, parrent });
        await CategoryModel.findByIdAndUpdate(parrent, {
            $push: { children: created },
        });
        return dto(created);
    },

    remove: async (id) => {
        const removed = await CategoryModel.findByIdAndDelete(id);
        return dto(removed);
    },

    update: async (id, update) => {
        const result = await CategoryModel.findByIdAndUpdate(id, update, {
            new: true,
        });
        return dto(result);
    },
};

function dto(category) {
    return {
        id: category._id.toString(),
        title: category.title,
        children: category.children.map(e => e._id.toString()),
    }
}