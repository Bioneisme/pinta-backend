import {NextFunction, Request, Response} from "express";
import logger from "../config/logger";
import {ContactStatus, UserRequest} from "../types";
import {DI} from "../index";
import {Relationships, Users} from "../entities";

class ContactController {
    async addContact(req: Request, res: Response, next: NextFunction) {
        try {
            const {phone} = req.body;
            const user = (req as UserRequest).user;
            const contact = await DI.em.findOne(Users, {phone});
            if (user && contact) {
                const relationship = DI.em.create(Relationships, {
                    user1: user,
                    user2: contact,
                    status: ContactStatus.pending
                });
                await DI.em.persistAndFlush(relationship);
                res.status(201).json({error: false, message: "contact_added", relationship});
                return next();
            }

            res.status(400).json({error: true, message: "user_or_contact_not_found"});
            return next();
        } catch (e) {
            logger.error(`addContact: ${e}`);
            res.status(400).json({error: true, message: e});
            next(e);
        }
    }

    async getContacts(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as UserRequest).user;
            const relationships = await DI.em.find(Relationships, {$or: [{user1: user}, {user2: user}]});
            res.json({error: false, relationships});
            return next();
        } catch (e) {
            logger.error(`getContacts: ${e}`);
            res.status(400).json({error: true, message: e});
            next(e);
        }
    }
}

export default new ContactController();