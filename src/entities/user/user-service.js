import { TokenService } from "../auth/token/token-service.js";
import { UserRepo } from "./user-repo.js"

export class UserService {
    static async findByToken(token) {
        const { user: userId } = await TokenService.findToken(token)
        const user = await UserRepo.getOneById(userId)
        return user;
    }
}