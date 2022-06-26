import { CategoryRepo } from "./category-repo.js";
import { CategoryDto } from "../../../../shared/dto/category-dto.js";

export class CategoryService {
    static async getAll() {
        const all = await CategoryRepo.getAll();
        const dto = all.map((cat) => {
            return new CategoryDto(cat);
        });
        return dto;
    }

    static async create(title) {
        const created = await CategoryRepo.create(title);
        const dto = new CategoryDto(created);
        return dto;
    }

    static async remove(id) {
        const { children } = await CategoryRepo.getOneById(id);
        children.forEach(async (e) => {
            await CategoryService.remove(e._id);
        });
        const parrent = await findParrent(id);
        await deleteFromChildren(parrent._id, id);
        const removed = await CategoryRepo.remove(id);
        const dto = new CategoryDto(removed);
        return dto;
    }

    static async update(id, updates) {
        const updated = await CategoryRepo.update(id, updates);
        const dto = new CategoryDto(updated);
        return dto;
    }

    static async move(dragId, dropId, dropPos) {
        const { _id: oldParrent_id } = await findParrent(dragId);
        await deleteFromChildren(oldParrent_id, dragId);

        let parrent_id = dropId;
        let position = 0;
        if (dropPos !== 0) {
            const parrent = await findParrent(dropId);
            parrent_id = parrent._id;
            position = parrent.children.indexOf(dropId);
            if (dropPos === 1) position++;
        }

        const updated = await addChild(parrent_id, dragId, position)
        const dto = new CategoryDto(updated);
        return dto;
    }
}

async function findParrent(id) {
    const parrent = await CategoryRepo.getOneByFilter({ children: id });
    return parrent;
}

async function deleteFromChildren(parrentId, childId) {
    await CategoryRepo.update(parrentId, {
        $pull: {
            children: childId,
        },
    });
}

async function addChild(parrentId, childId, position = 0) {
    const updated = await CategoryRepo.update(
        parrentId,
        {
            $push: {
                children: {
                    $each: [childId],
                    $position: position,
                }
            },
        },
        { new: true }
    );
    return updated;
}