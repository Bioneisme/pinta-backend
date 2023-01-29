import {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} from "../config/settings";
import jwt from "jsonwebtoken";
import {DI} from "../index";
import {Tokens} from "../entities";

class TokenService {
    generateTokens(id: number): { accessToken: string, refreshToken: string } {
        const accessToken = jwt.sign({id}, JWT_ACCESS_SECRET, {expiresIn: '3h'}) // TODO: config
        const refreshToken = jwt.sign({id}, JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    verifyAccessToken(token: string) {
        try {
            return jwt.verify(
                token,
                JWT_ACCESS_SECRET
            );
        } catch (e) {
            return null;
        }
    }

    verifyRefreshToken(token: string) {
        try {
            return jwt.verify(
                token,
                JWT_REFRESH_SECRET
            );
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId: number, refreshToken: string) {
        const token = await DI.em.findOne(Tokens, {user: userId});
        if (token) {
            token.token = refreshToken;
            await DI.em.persistAndFlush(token);
            return token;
        }

        const newToken = DI.em.create(Tokens, {user: userId, token: refreshToken});
        await DI.em.persistAndFlush(newToken);
        return newToken;
    }

    async removeToken(refreshToken: string) {
        const token = await DI.em.findOne(Tokens, {token: refreshToken});
        if (token) {
            await DI.em.removeAndFlush(token);
            return true;
        }
        return false;
    }

    async findToken(refreshToken: string) {
        return await DI.em.findOne(Tokens, {token: refreshToken});
    }
}

export default new TokenService();