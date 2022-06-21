import mongoose from 'mongoose'

const Schema = mongoose.Schema

const RoleSchema = new Schema({
    value: {type: String, unique: true, default: 'user'},
})

const RoleModel = mongoose.model('role', RoleSchema)

export {RoleModel as default}