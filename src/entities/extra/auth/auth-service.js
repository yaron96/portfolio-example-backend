import bcrypt from 'bcryptjs'
import {v4 as uuidv4} from 'uuid'
import { UserModel } from './user/user-model.js'
import { UserDto } from './user/user-dto.js'
import { MailService } from '../../../shared/services/mail-service.js'
import { TokenService } from './token/token-service.js'
import { AuthError } from '../../../exceptions/auth-error.js'

export const AuthService = {

    registration: async (email, password) => {
        const isEmailExist = await UserModel.findOne({email})
        if (isEmailExist) {
            throw AuthError.BadRequest('user with this email is already exists')
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuidv4()
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await MailService.sendActivationMail(
            email, `${process.env.API_URL}/auth/activate/${activationLink}`)

        const userDto = new UserDto(user) // id email isActivated
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    },

    activate: async (activationLink) => {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw AuthError.BadRequest('incorrect link')
        }
        console.log(user)
        user.isActivated = true
        await user.save()
    },

    login: async (email, password) => {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw AuthError.BadRequest('user with this email is not found')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw AuthError.BadRequest('incorrect password')
        }
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    },

    logout: async (refreshToken) => {
        const token = await TokenService.removeToken(refreshToken)
        return token
    },

    refresh: async (refreshToken) => {
        if (!refreshToken) {
            throw AuthError.UnauthorizedError()
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw AuthError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    },

    getAllUsers: async () => {
        const users = UserModel.find()
        return users
    }
}
