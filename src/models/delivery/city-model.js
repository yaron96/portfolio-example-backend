import mongoose from 'mongoose'

const Schema = mongoose.Schema

function DaysLimitAndNotNull(val) {
    //return val.length = 7 && !val.includes(null)
    return val.length === 7 && !val.includes(null);

}

const CitySchema = new Schema({
    Description: {
        type: String
    },
    DescriptionRu: {
        type: String
    },
    Ref: {
        type: String,
        unique: true
    },
    AreaRef: {
        type: String
    },
    DeliveryDays: {
        type: [{
            type: Boolean,
        }],
        validate: [DaysLimitAndNotNull, '{PATH} exceeds the limit of 7 OR includes NULL']
    },
    Area: {
        type: Schema.Types.ObjectId,
        ref: 'area'
    },
    SettlementTypeDescriptionRu: {
        type: String
    },
    SettlementTypeDescription: {
        type: String
    },
})

const CityModel = mongoose.model('city', CitySchema)

export {CityModel as default}