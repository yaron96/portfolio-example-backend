export class ProductDto {
    constructor(product) {
        this.id = product._id
        this.title = product.title
        this.description = product.description
        this.category = product.category
        this.images = product.images
        this.price = product.price
    }
}