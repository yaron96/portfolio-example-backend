import { CategoryService } from "./category-service.js";

export const CategoryController = {
    getAll: async (req, res, next) => {
        const categories = await CategoryService.getAll();
        res.json(categories);
    },
    create: async (req, res, next) => {
        const { title } = req.body;
        const created = await CategoryService.create(title);
        res.json(created);
    },
    remove: async (req, res, next) => {
        const { id } = req.params;
        const removed = await CategoryService.remove(id);
        res.json(removed);
    },
    update: async (req, res, next) => {
        const { id } = req.params;
        const updates = req.body;
        const updated = await CategoryService.update(id, updates);
        res.json(updated);
    },
    move: async (req, res, next) => {
        const { id: drag_id } = req.params;
        const { drop_id, drop_pos } = req.body
        const updatedParrent = 
            await CategoryService.move(drag_id, drop_id, drop_pos)
        res.json(updatedParrent)
    },
};
