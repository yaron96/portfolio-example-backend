import { ImageExtensionRepo } from './img-extens-repo.js'

export class ImageExtensionService {

    static localStore = []

    static _staticConstructor = (function() {
        this.update()
    }).bind(this)()

    static async getAll() {
        const result = await ImageExtensionRepo.findAll()
        return result
    }

    static async getExtensionValue(mimetype) {
        const extension = await this.getOneByMimeType(mimetype)
        return extension.value
    }

    static async getOneByMimeType(mimetype) {
        const result = this.localStore.find(ext => ext.mimetype === mimetype)
        return result
    }

    static async update() {
        this.localStore = await this.getAll()
    }

}
