import {Request, Response, NextFunction} from "express";
import {Users} from "../entities";
import {DI} from "../index";
import logger from "../config/logger";

class AdminController {
    async getUsers(req: Request, res: Response) {
        try {
            const users = await DI.em.find(Users, {});
            res.json({error: false, message: "get_users_success", users});
        } catch (e) {
            logger.error(`getUsers: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }
}

export default new AdminController();