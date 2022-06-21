export class ProductDraftDto {
    constructor(draft) {
        this.id = draft._id
        this.product_id = draft.product_id
        this.title = draft.title
        this.description = draft.description
        this.category = draft.category
        this.images = draft.images
        this.price = draft.price
    }
}