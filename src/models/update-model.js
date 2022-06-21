import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UpdateSchema = new Schema({
    date: {
        type: Date
    }
})

const UpdateModel = mongoose.model('update', UpdateSchema)


export {UpdateModel as default}