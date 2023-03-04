import logger from "../config/logger";
import {DI} from "../index";
import {NextFunction, Request, Response} from "express";
import {UserRequest} from "../types";
import {Tokens, Users} from "../entities";
import {generateRandomCode} from "../utils/generateRandomCode";
import axios from "axios";
import {BOT_TOKEN, CHAT_ID, EXPIRY_TIME} from "../config/settings";
import {redis} from "../utils/cache";
import moment from "moment";
import tokenService from "../services/tokenService";
import {wrap} from "@mikro-orm/core";

class UserController {
    async sendCode(req: Request, res: Response) {
        try {
            const {phone} = req.body;
            if (!phone) {
                res.status(400).json({error: true, message: "phone_not_found"});
                return;
            }
            const code = generateRandomCode(1000, 9999);

            axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: `Номер телефона: *${phone}*\nКод: *${code}*\nДата: *${new Date().toLocaleString()}*\n` +
                    `Expires: *${EXPIRY_TIME}s* (${moment().add(EXPIRY_TIME, 'seconds').format("HH:mm:ss DD.MM.YYYY")})`,
                parse_mode: "Markdown"
            }).then(() => {
                res.json({error: false, message: "code_sent"});
                redis.setEx(phone, EXPIRY_TIME, code.toString());
                return;
            }).catch(e => {
                res.status(400).json({error: true, message: e});
                return;
            });
        } catch (e) {
            logger.error(`SendCode: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }

    async checkCode(req: Request, res: Response) {
        try {
            const {phone, code, deviceToken, name} = req.body;
            if (!phone || !code || !name || !deviceToken) {
                res.status(400).json({error: true, message: "missing_params"});
                return;
            }
            redis.get(phone).then(async result => {
                if (!result) {
                    res.status(400).json({error: true, message: "code_not_found_or_expired"});
                    return;
                }
                if (result === code) {
                    let user = await DI.em.findOne(Users, {phone});
                    if (!user) {
                        user = DI.em.create(Users, {phone, deviceToken, name});
                    }
                    wrap(user).assign({deviceToken, name});
                    await DI.em.persistAndFlush(user);

                    const tokens = tokenService.generateTokens(user.id);
                    await tokenService.saveToken(user.id, tokens.refreshToken);

                    res.cookie("refreshToken", tokens.refreshToken, {
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                        httpOnly: true
                    });
                    res.json({error: false, message: "code_valid", ...tokens, user});
                    await redis.del(phone);
                    return;
                }

                res.status(400).json({error: true, message: "code_invalid"});
                return;
            }).catch(e => {
                res.status(400).json({error: true, message: e});
                return;
            });
        } catch (e) {
            logger.error(`CheckCode: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const {refreshToken} = req.cookies;
            await tokenService.removeToken(refreshToken);
            res.clearCookie("refreshToken");
            res.json({error: false, message: "logout_success"});
            return;
        } catch (e) {
            logger.error(`logout: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                res.status(401).json({error: true, message: "unauthorized"});
                return;
            }
            const userData: any = tokenService.verifyRefreshToken(refreshToken);
            const token = await DI.em.findOne(Tokens, {token: refreshToken});
            if (!token || !userData) {
                res.status(401).json({error: true, message: "unauthorized"});
                return;
            }
            const user = await DI.em.findOne(Users, {id: userData.id});
            if (user) {
                const tokens = tokenService.generateTokens(user.id);
                await tokenService.saveToken(user.id, tokens.refreshToken);
                res.cookie("refreshToken", tokens.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                });
                res.json({error: false, message: "refresh_success", ...tokens, user});
                return;
            }

            res.status(401).json({error: true, message: "unauthorized"});
            return;
        } catch (e) {
            logger.error(`refresh: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }

    async getMe(req: Request, res: Response) {
        try {
            const {user} = req as UserRequest;
            res.json({error: false, message: "get_me_success", user});
        } catch (e) {
            logger.error(`getMe: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }

    async changeNotifyMinutes(req: Request, res: Response) {
        try {
            const {user} = req as UserRequest;
            if (!user) {
                res.status(401).json({error: true, message: "unauthorized"});
                return;
            }
            const {minutes} = req.body;
            if (!minutes) {
                res.status(400).json({error: true, message: "minutes_not_found"});
                return;
            }
            wrap(user).assign({minutes});
            await DI.em.persistAndFlush(user);
            res.json({error: false, message: "change_notify_minutes_success", user});
            return;
        } catch (e) {
            logger.error(`changeNotifyMinutes: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }
}

export default new UserController();