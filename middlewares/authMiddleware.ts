import logger from "../config/logger";
import {DI} from "../index";
import {Response, Request, NextFunction} from "express";
import {Users} from "../entities";
import {UserRequest} from "../types";
import tokenService from "../services/tokenService";


export default async function (req: Request, res: Response, next: NextFunction) {
    let token;

    if (req.headers && req.headers.authorization?.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded: any = tokenService.verifyAccessToken(token);

            if (decoded) {
                const id: number = decoded.id;

                const user = await DI.em.findOne(Users, {id});
                if (!user) return res.status(404).json({error: true, message: "user_not_found"});
                (req as UserRequest).user = user;

                next();
            } else {
                res.status(400).json({error: true, message: "invalid_token"});
                return;
            }
        } catch (e) {
            res.status(400).json({error: true, message: "invalid_token"});
            logger.error(`Invalid Token: ${e}`);
            return;
        }
    }

    if (!token) {
        res.status(401).json({error: true, message: "unauthorized"});
        return;
    }
}
