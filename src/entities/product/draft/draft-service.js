import { DraftRepo } from "./draft-repo.js"
import { ProductService } from '../product-service.js'
import { ImageService } from "../../image/image-service.js"

export class DraftService {

    static async create(productId) {
        if (productId) {
            const product = await ProductService.getOneById(productId);
            const props = getPropsOfModel(product);
            props.productId = productId;
            const draft = await DraftRepo.create(props);
            await Promise.all(
                draft.images.map(async (imgId) => {
                    await ImageService.addOwner(imgId, draft.id);
                })
            );
            return draft;
        } else {
            const draft = await DraftRepo.create()
            return draft
        }
    }

    static async getById(id) {
        const found = await DraftRepo.getById(id)
        return found
    }

    static async update(id, updates) {
        console.log('update')
        console.log(id)
        console.log(updates)
        const updated = await DraftRepo.update(id, updates)
        return updated
    }

    static async delete(id) {
        const draft = await DraftRepo.getById(id)
        await Promise.all(draft.images.map(async (imgId) => {
            await ImageService.removeOwner(imgId, id)
        }))
        return DraftRepo.delete(id)
    }

    static async imagesAdd(id, imageFiles) {
        const imageIdArr = await Promise.all(imageFiles.map(async (file) => {
            const ImgId = await ImageService.save(file)
            await ImageService.addOwner(ImgId, id)
            return ImgId
        }))
        await DraftRepo.update(
            id,
            {$push: {images: imageIdArr}})
        return imageIdArr
    }

    static async imagesSort(id, sorted) {
        const updated = await DraftRepo.update(id, {
            images: sorted
        })
        return updated.images
    }

    static async imageDelete(id, imgId) {
        await ImageService.removeOwner(imgId, id)
        await DraftRepo.update(
            id, 
            {$pull: {images: imgId}})
        return imgId
    }

}

//TODO!!!
function getPropsOfModel(model) {
    delete model.id
    return model
}