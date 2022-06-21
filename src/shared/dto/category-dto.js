export class CategoryDto {
    constructor(category) {
        this.id = category._id
        this.title = category.title
        this.children = category.children
    }
}