import { DraftModel } from "./draft-model.js";

export class DraftRepo {
    static async create(props) {
        const created = await DraftModel.create(props);
        return dto(created);
    }

    static async getById(id) {
        const found = await DraftModel.findById(id);
        return dto(found);
    }

    static async update(id, updates, returnNew = true) {
        const updated = await DraftModel.findByIdAndUpdate(id, updates, {
            new: returnNew,
        });
        return dto(updated);
    }

    static async delete(id) {
        const deleted = await DraftModel.findByIdAndDelete(id);
        return deleted;
    }
}

function dto(draft) {
    console.log(draft)
    return {
        id: draft._id.toString(),
        title: draft.title,
        description: draft.description,
        price: draft.price,
        category: draft.category,
        images: draft.images.map((e) => e._id.toString()),
        productId: draft.productId ? draft.productId.toString() : null,
    };
}
