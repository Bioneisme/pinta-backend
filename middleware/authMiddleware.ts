import {verifyJWT} from "../helpers/jwt";
import logger from "../config/logger";
import {DI} from "../index";
import {Response, Request, NextFunction} from "express";
import {Users} from "../entities";
import {UserRequest} from "../types";


export default async function protectedRoute(req: Request, res: Response, next: NextFunction) {
    let token;

    if (req.headers && req.headers.authorization?.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = verifyJWT(token);

            const id: number = (decoded as { id: number }).id;

            const user = await DI.em.findOne(Users, {id});
            if (!user) return res.status(400).send("User not found");
            (req as UserRequest).user = user;

            next();
        } catch (e) {
            res.status(400).send("Invalid token");
            logger.error(`Invalid Token: ${e}`);
        }
    }

    if (!token) {
        res.status(401).send("Authorization token not found");
    }
}
