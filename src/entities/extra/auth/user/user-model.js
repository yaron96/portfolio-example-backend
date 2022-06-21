import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = new Schema({
    //username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    //roles: [{type: String, ref: 'role'}]
})

export const UserModel = mongoose.model('user', UserSchema)

