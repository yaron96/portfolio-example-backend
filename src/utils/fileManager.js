import { promises as fs } from 'fs'
import * as oldfs from 'fs'

import path from 'path'

import { fileURLToPath } from 'url'

export class FileManager {

    static PATH_PROJECT_DIR = this.getPathToProject() //TODO env.pathtoproj || this.getPath
    static PATH_TEMP_DIR = path.join(this.PATH_PROJECT_DIR + '/files/temp')
    static PATH_IMAGES_DIR = path.join(this.PATH_PROJECT_DIR + '/files/images')

    static getPathToProject() {
        let filepath = fileURLToPath(import.meta.url)
        const pathArr = filepath.split('/')
        pathArr.every((element, index) => {
            if (element === 'src') {
                pathArr.splice(index, pathArr.length - index)
                return false
            }
            return true
        })
        filepath = pathArr.join('/')
        return filepath
    }

    static async isExists(_path) {
        return fs.access(_path, oldfs.constants.F_OK)
            .then(() => true)
            .catch(() => false)
    }

    static async isDirEmpty(_path) {
        return fs.readdir(_path).then(files => {
            return files.length === 0
        })
    }

    static async createDir(_path) {
        return await fs.mkdir(_path)
    }

    static async saveFile(_path, file) {
        return await fs.writeFile(_path, file)
    }

    static async createPath(_path) {
        const pathArr = _path.split('/')
        for (let i = 0; i <= pathArr.length; i++) {
            const tempPath = '/' + path.join(...pathArr.slice().slice(0, i))
            await this.isExists(tempPath)
                || await this.createDir(tempPath)
        }
    }

    static async readFile(_path) {
        return await fs.readFile(_path)
    }

    static async deleteFile(_path) {
        return await fs.unlink(_path)
    }

    static async deleteDir(_path) {
        return fs.rmdir(_path)
    }

    static async findFilenameInDir(_path, filename) {
        const files = await fs.readdir(_path)
        if (!files.length) return false
        const result = files.find(el => el.includes(filename))
        return result
    }

    static async createPathAndSaveFile(_path, filename, file) {
        if (!await this.isExists(_path)) 
            await this.createPath(_path)
        await this.saveFile(path.join(_path, filename), file)
    }
}
