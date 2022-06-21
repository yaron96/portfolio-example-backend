import { ImageService } from './image-service.js'

export const ImageController = {

    getOneByUrl: async (req, res) => {
        const { id } = req.params
        const path = await ImageService.readAsPath(id)
        return res.sendFile(path)
    },

    getOneThumbByUrl: async (req, res) => {
        const { id } = req.params
        const isThumb = true
        const path = await ImageService.readAsPath(id, isThumb)
        return res.sendFile(path) 
    }

}
