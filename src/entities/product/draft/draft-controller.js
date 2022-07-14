import { DraftService } from "./draft-service.js";

export const DraftController = {
    create: async (req, res) => {
        const { productId } = req.body;
        const draft = await DraftService.create(productId);
        return res.json(draft);
    },
    update: async (req, res) => {
        const { id } = req.params
        const update = req.body;
        const updated = await DraftService.update(id, update);
        return res.json(updated);
    },
    imagesUpload: async (req, res) => {
        const { id } = req.params;
        const imageFiles = req.files;
        const result = await DraftService.imagesAdd(id, imageFiles);
        res.json(result);
    },
    imagesSort: async (req, res) => {
        const { id } = req.params;
        const sorted = req.body;
        console.log(sorted)
        const updatedImages = await DraftService.imagesSort(id, sorted);
        return res.json(updatedImages);
    },
    imageDelete: async (req, res) => {
        const { id, imgId } = req.params;
        const deletedLink = await DraftService.imageDelete(id, imgId);
        return res.json(deletedLink);
    },
};
