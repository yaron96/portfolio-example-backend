import { UserService } from "./user-service.js"

export const UserController = {
    me: async (req, res) => {
        console.log(req.cookies)
        const { refreshToken } = req.cookies;
        const user = await UserService.findByToken(refreshToken)
        return res.json(user)
    }
}