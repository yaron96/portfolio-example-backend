import { UserModel } from "./user-model.js"

export class UserRepo {
    static async getOneById (id) {
        const user = await UserModel.findById(id)
        return dto(user)
    }
}

function dto(user) {
    return {
        email: user.email,
        isActivated: user.isActivated,
    }
}