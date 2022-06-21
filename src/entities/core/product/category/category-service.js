import { CategoryRepo } from './category-repo.js'
import { CategoryDto } from '../../../../shared/dto/category-dto.js'

export class CategoryService {

    static async getAll() {
        const all = await CategoryRepo.getAll()
        const dto = all.map((cat) => {
            return new CategoryDto(cat)
        })
        return dto
    }

    static async create(title) {
        const created = await CategoryRepo.create(title)
        const dto = new CategoryDto(created)
        return dto
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
        const updated = await CategoryRepo.update(id, updates)
        return updated
    }
}

async function findParrent(id) {
    const parrent = await CategoryRepo.getOneByFilter({ children: id })
    return parrent
}

async function deleteFromChildren(parrentId, childId) {
    const updated = await CategoryRepo.update(parrentId, {
        $pull: {
            children: childId,
        },
    });
}

async function initNode(node) {
    const dto = new CategoryDto(node)
    if (dto.children) {
        dto.children = await Promise.all(
            dto.children.map(async (child) => {
                const childModel = await CategoryRepo.getOneByFilter({ _id: child });
                const childTree = await initNode(childModel);
                return childTree;
            })
        );
    }
    return dto
}

class Service {
    static NODE_PROPS = ['title', 'children']

    static async getAll() {
        const rootNode = await CategoryRepo.getRootNode()
        console.log('rootnode')
        console.log(rootNode)
        const root = await initNode(rootNode)
        return root
    }

    static async update(updatedNode) {
        const currentNode = await this.getAll()
        await updateNode([updatedNode], [currentNode])
        const updated = await this.getAll()
        return updated

        async function updateNode(updated, current, parrentId) {
            if (updated.length != current.length) {
                const addedNodes = getAddedNodes()
                for (const item of addedNodes) {
                    if (!item._id) {
                        return addNode(item, parrentId)
                    } else {
                        return moveNode(item, parrentId)
                    }
                }
                const deletedNodes = getDeletedNodes()
                for (const item of deletedNodes) {
                    const newParrent = findNewParrent(item)
                    if (newParrent) {
                        return moveNode(item, newParrent._id)
                    } else {
                        return deleteNode(item)
                    }
                }
            } else {

                const sorted = (arr1, arr2) => {
                    for (const [index] of arr1.entries()) {
                        if (arr1[index]._id != arr2[index]._id) {
                            return true
                        }
                    }
                    return false
                }

                if (sorted(current, updated))
                    return sortChildren(updated, current, parrentId)

                const renamed = (curr, upd) => {
                    for (const [index] of curr.entries()) {
                        if (curr[index].title != upd[index].title)
                            return true
                    }
                }

                if (renamed(current, updated))
                    return changeTitle(updated, current)

                for (const [index, value] of current.entries()) {
                    const result = await updateNode(
                        updated[index].children,
                        current[index].children,
                        value
                    )
                    if (result) return result
                }

            }

            function getAddedNodes() {
                const arr = []
                for (const node of updated) {
                    if (!findNodeById(current, node._id))
                        arr.push(node)
                }
                return arr
            }

            function getDeletedNodes() {
                const arr = []
                for (const node of current) {
                    if (!findNodeById(updated, node._id)) arr.push(node)
                }
                return arr
            }

            function findNodeById(nodes, id) {
                for (const node of nodes) {
                    if (node._id == id) return node
                }
            }

            function findNewParrent(target, node = updatedNode) {
                const found = node.children.find(i => i._id == target._id)
                if (found) return node
                else {
                    for (const item of node.children) {
                        const temp = findNewParrent(target, item)
                        if (temp) return temp
                    }
                }
            }

            async function addNode(node) {
                const result = await CategoryRepo.create(node.title, parrentId)
                return result
            }

            async function moveNode(node, newParrentId) {
                await CategoryRepo.deleteChild(node._id)
                const result = await CategoryRepo.addChild(newParrentId, node._id)
                return result
            }

            async function sortChildren(update, old, parrentId) {
                const childrenArr = await Promise.all(
                    update.map(async i => await CategoryRepo.getOneById(i._id)))
                const result = await CategoryRepo.update(
                    parrentId, { children: childrenArr })
                return result
            }

            async function changeTitle(update, old) {
                for (const [index] of update.entries()) {
                    if (update[index].title != old[index].title) {
                        const result = await CategoryRepo.update(
                            update[index]._id,
                            { title: update[index].title })
                        return result
                    }
                }
            }

            async function deleteNode(node) {
                await CategoryRepo.deleteChild(node._id)
                const result = await CategoryRepo.delete(node._id)
                return result
            }
        }
    }
}
