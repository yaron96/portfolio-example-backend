import { ProductRepo } from './product-repo.js'
import { ImageService } from '../image/image-service.js'
import { DraftService } from './draft/draft-service.js'

export const ProductService = {
    getMany: async (query) => {
        console.log(query)
        const { page, take } = query;

        const filter = {};

        if (query.category) {
            filter.category = query.category;
        }

        if (query.minPrice || query.maxPrice) {
            filter.price = {}
            if (query.minPrice) {
                filter.price.$gte = query.minPrice;
            }
            if (query.maxPrice) {
                filter.price.$lte = query.maxPrice;
            }
        }

        const sort = {}
        sort[query.sort[0]] = query.sort[1]

        const { data, totalCount } = await ProductRepo.getMany(
            filter,
            take,
            page,
            sort,
        );
        const meta = {
            page: parseInt(page),
            take: parseInt(take),
            total: totalCount,
        };

        return { data, meta };
    },

    create: async (draftId) => {
        const draft = await DraftService.getById(draftId);
        const props = draftToProductProps(draft);
        const created = await ProductRepo.create(props);
        created.images.map(async (imageId) => {
            await ImageService.addOwner(imageId, created.id);
        });
        await DraftService.delete(draftId);
        return created;
    },

    getOneById: async (productId) => {
        const product = await ProductRepo.getOneById(productId);
        return product;
    },

    update: async (draftId) => {
        const draft = await DraftService.getById(draftId);
        const productId = draft.productId;
        
        const update = draftToProductProps(draft);
        await updateImgsOwner(productId, update.images);
        await DraftService.delete(draftId);
        const updated = await ProductRepo.update(productId, update);

        return updated;

        async function updateImgsOwner(productId, updatedImages) {
            console.log("productId")
            console.log(productId)
            const current = await ProductRepo.getOneById(productId);
            await Promise.all(
                updatedImages.map(async (imgId) => {
                    if (!current.images.includes(imgId)) {
                        await ImageService.addOwner(imgId, productId);
                    }
                })
            );
        }
    },

    delete: async (productId) => {
        // const currModel = getModel(productId);
        // const { images } = await ProductRepo.getOneById(productId);
        // if (images.length) {
        //     for (const imgId of images) {
        //         await ImageService.delete(currModel, imgId);
        //     }
        // }
        // await ProductRepo.delete(productId);
    },
};

//TODO!!!
function draftToProductProps(model) {
    // const object = model.toObject()
    // delete object._id
    // delete object.__v
    // delete object.createdAt
    // delete object.updatedAt
    // delete object.productId
    // return object
    delete model.productId;
    return model    
}
