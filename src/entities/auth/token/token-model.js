import mongoose from 'mongoose'

const Schema = mongoose.Schema

const TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    refreshToken: {type: String, required: true}
    //todo browser fingerprint, user IP
})

export const TokenModel = mongoose.model('token', TokenSchema)
