import path from 'path'
import sharp from 'sharp'
import { FileManager } from '../../utils/fileManager.js'
import { ImageRepo } from './image-repo.js'
import { ImageExtensionService } from './image-extension/img-extens-service.js'

export class ImageService {

    static async save(imageFile) {
        const tempFilePath = path.join(
            FileManager.PATH_TEMP_DIR, imageFile.filename)
        const file = await FileManager.readFile(tempFilePath)
        await FileManager.deleteFile(tempFilePath)

        const extension =
                await ImageExtensionService.getOneByMimeType(imageFile.mimetype)
        const imageModel = await ImageRepo.create(extension)
        const filename = imageModel._id + '.' + extension.value

        await saveOriginal()
        await createAndSaveThumb()

        return imageModel._id

        async function saveOriginal() {
            console.log('saveOriginal')
            await FileManager.createPathAndSaveFile(
                FileManager.PATH_IMAGES_DIR,
                filename,
                file)
        }

        async function createAndSaveThumb() {
            const thumbfile = await sharp(path.join(FileManager.PATH_IMAGES_DIR, filename))
                .resize({
                    width: 250,
                    height: 250,
                    fit: sharp.fit.inside
                })
                .toBuffer()

            const pathThumbsDir = path.join(FileManager.PATH_IMAGES_DIR, 'thumbs')
            await FileManager.createPathAndSaveFile(
                pathThumbsDir,
                filename,
                thumbfile)
        }
    }

    static async readAsPath(imageId, thumb = false) {
        let pathToDir = FileManager.PATH_IMAGES_DIR
        if (thumb)
            pathToDir = path.join(pathToDir, 'thumbs')
        const filename = await FileManager.findFilenameInDir(
            pathToDir, imageId)
        const pathToFile = path.join(pathToDir, filename)
        return pathToFile
    }

    static async delete(image_id) {
        const filename = await FileManager.findFilenameInDir(
            FileManager.PATH_IMAGES_DIR, image_id)

        await deleteThumb()
        await deleteOriginal()
        await ImageRepo.delete(image_id)

        async function deleteThumb() {
            const pathThumbsDir = path.join(FileManager.PATH_IMAGES_DIR, 'thumbs')
            const pathToFile = path.join(pathThumbsDir, filename)
            await FileManager.deleteFile(pathToFile)
        }

        async function deleteOriginal() {
            const pathToFile = path.join(
                FileManager.PATH_IMAGES_DIR, filename)
            await FileManager.deleteFile(pathToFile)
        }
    }

    static async addOwner(image_id, owner_id) {
        await ImageRepo.update(
            image_id,
            {$push: {owners: owner_id}})
    }

    static async removeOwner(imgId, ownerId) {
        const image = await ImageRepo.getOneById(imgId)
        image.owners = image.owners.filter((id) => id != ownerId)
        console.log(image)
        if (image.owners.length) {
            await image.save()
        } else {
            console.log('delete img')
            await this.delete(imgId)
        }
    }
}
