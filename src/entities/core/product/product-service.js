import { DraftRepo, ProductRepo } from './product-repo.js'
import { ImageService } from '../image/image-service.js'
import { ProductDto } from '../../../shared/dto/product-dto.js'

const MODEL_NAME = 'product'

export const ProductService = {

    getMany: async (take, page) => {
        const { result, totalCount } = await ProductRepo.getMany(
            null, take, page)

        const data = result.map((item) => {
            const dto = new ProductDto(item)
            return {...dto}
        })

        const meta = { page: 1, take: 10, total: totalCount}

        return { data, meta }
    },

    create: async (draft_id) => {
        const draft = await DraftService.getById(draft_id)
        const props = getPropsOfModel(draft)
        const created = await ProductRepo.create(props)
        created.images.map(async (image_id) => {
            await ImageService.addOwner(image_id, created._id)
        })
        await DraftService.delete(draft_id)
        return created
    },

    getOneById: async (product_id) => {
        const product = await ProductRepo.getOneById(product_id)
        return product
    },
    
    update: async (draft) => {
        console.log(draft)
        const updated = await ProductRepo.update(
            draftModel.productId, getPropsOfModel(draftModel))
        await DraftRepo.delete(draft)
        return updated
    },

    delete: async (product_id) => {
        const currModel = getModel(product_id)
        const { images } = await ProductRepo.getOneById(product_id)
        if (images.length) {
            for (const imgId of images) {
                await ImageService.delete(currModel, imgId)
            }
        }
        await ProductRepo.delete(product_id)
    },
}

export class DraftService {

    static async create(product_id) {
        if (product_id) {
            const product = await ProductService.getOneById(product_id)
            const props = getPropsOfModel(product)
            props.productId = product._id
            const draft = await DraftRepo.create(props)
            await Promise.all(draft.images.map(async (image_id) => {
            await ImageService.addOwner(image_id, draft._id)}))
            return draft
        } else {
            const draft = await DraftRepo.create()
            return draft
        }
    }

    static async getById(draft_id) {
        const editable = await DraftRepo.getById(draft_id)
        return editable
    }

    static async update(update) {
        const draft_id = update._id
        delete update._id
        const updated = await DraftRepo.update(draft_id, update)
        return updated
    }

    static async delete(draft_id) {
        const draft = await DraftRepo.getById(draft_id)
        await Promise.all(draft.images.map(async (image_id) => {
            await ImageService.removeOwner(image_id, draft_id)
        }))
        return DraftRepo.delete(draft_id)
    }

    static async imagesAdd(draft_id, imageFiles) {
        const image_idArr = await Promise.all(imageFiles.map(async (file) => {
            const image_id = await ImageService.save(file)
            await ImageService.addOwner(image_id, draft_id)
            return image_id
        }))
        await DraftRepo.update(
            draft_id,
            {$push: {images: image_idArr}})
        return image_idArr
    }

    static async imagesSort(draft_id, sorted) {
        const result = await DraftRepo.update(draft_id, {
            images: sorted
        })
        return result.images
    }

    static async imagesDelete(draft_id, image_id) {
        const product = await DraftRepo.getById(draft_id)
//        const imageIndex = product.images.findIndex(image => image._id == image_id)
//        product.images.splice(imageIndex, 1)
        product.images.filter(image => image =! image_id)
        product.save()
        await ImageService.removeOwner(image_id, draft_id)
        return image_id
    }

}

function getModel(id) {
    return {
        name: MODEL_NAME,
        id: id
    }
}


//TODO!!!
function getPropsOfModel(model) {
    const object = model.toObject()
    delete object._id
    delete object.__v
    delete object.createdAt
    delete object.updatedAt
    return object
}
