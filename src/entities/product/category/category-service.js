import { CategoryRepo, ROOT_ID } from "./category-repo.js";

export class CategoryService {
    static async getAll() {
        const array = await CategoryRepo.getAll();
        const tree = arrToTree(array);
        return tree;
    }

    static async create(title) {
        const created = await CategoryRepo.create(title);
        return created;
    }

    static async remove(id) {
        const { children } = await CategoryRepo.getOneById(id);
        children.forEach(async (e) => {
            await CategoryService.remove(e);
        });
        const parrent = await findParrent(id);
        await deleteChild(parrent.id, id);
        const removed = await CategoryRepo.remove(id);
        return removed;
    }

    static async update(id, updates) {
        const updated = await CategoryRepo.update(id, updates);
        return updated;
    }

    static async move(dragId, dropId, dropPos) {
        const { id: oldParrentId } = await findParrent(dragId);

        let newParrentId = dropId;
        let position = 0;
        if (dropPos !== 0) {
            const parrent = await findParrent(dropId);
            newParrentId = parrent.id;
            position = parrent.children.indexOf(dropId);
            if (dropPos === 1) position++;
        }

        await moveChild(dragId, oldParrentId, newParrentId, position)
        return this.getAll();
    }
}

function arrToTree(arr) {
    const rootNode = arr.find((item) => item.id === ROOT_ID);

    return initNode(rootNode);

    function initNode(node) {
        node.children = node.children.map((id) => {
            const child = arr.find((item) => item.id === id);
            return initNode(child);
        });
        return node;
    }
}

async function findParrent(id) {
    const parrent = await CategoryRepo.getOneByFilter({ children: id });
    return parrent;
}

async function addChild(parrentId, childId, position = 0) {
    await CategoryRepo.update(parrentId, {
        $push: {
            children: {
                $each: [childId],
                $position: position,
            },
        },
    });
}

async function deleteChild(parrentId, childId) {
    await CategoryRepo.update(parrentId, {
        $pull: {
            children: childId,
        },
    });
}

async function moveChild(childId, oldParrentId, newParrentId, position) {
    await deleteChild(oldParrentId, childId);
    await addChild(newParrentId, childId, position);
}