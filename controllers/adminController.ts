import {Request, Response, NextFunction} from "express";
import {Users} from "../entities";
import {DI} from "../index";
import logger from "../config/logger";

class AdminController {
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await DI.em.find(Users, {});
            res.json({error: false, message: "get_users_success", users});
            return next();
        } catch (e) {
            logger.error(`getUsers: ${e}`);
            res.status(500).json({error: true, message: e});
            next(e);
        }
    }
}

export default new AdminController();