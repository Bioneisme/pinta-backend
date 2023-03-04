import {NextFunction, Request, Response} from "express";
import logger from "../config/logger";
import {ContactStatus, UserRequest} from "../types";
import {DI} from "../index";
import {Relationships, Users} from "../entities";
import apnService from "../services/apnService";

class ContactController {
    async sendInvite(req: Request, res: Response) {
        try {
            const {phone} = req.body;
            const user = (req as UserRequest).user;
            const contact = await DI.em.findOne(Users, {phone});
            if (user && contact) {
                const existingRelationship = await DI.em.findOne(Relationships, {
                    $or: [
                        {user1: user, user2: contact},
                        {user1: contact, user2: user}
                    ]
                });
                if (existingRelationship) {
                    res.status(400).json({error: true, message: "relationship_already_exists"});
                    return;
                }
                const relationship = DI.em.create(Relationships, {
                    user1: user,
                    user2: contact,
                    status: ContactStatus.pending
                });
                await DI.em.persistAndFlush(relationship);
                const result = await apnService.sendNotification(contact.deviceToken, "Вам поступило новое приглашение в контакты");
                if (!result.error) {
                    res.status(201).json({error: false, message: ["invite_sent", "notification_sent"], relationship});
                } else {
                    res.status(201).json({error: false, message: "invite_sent", relationship});
                }
                return;
            }

            res.status(400).json({error: true, message: "user_or_contact_not_found"});
            return;
        } catch (e) {
            logger.error(`sendInvite: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }

    async getInvites(req: Request, res: Response) {
        try {
            const user = (req as UserRequest).user;
            const relationships = await DI.em.find(Relationships, {
                user2: user,
                status: ContactStatus.pending
            }, {populate: true});
            res.json({error: false, message: "invites_found", relationships});
            return;
        } catch (e) {
            logger.error(`getInvites: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }

    async acceptInvite(req: Request, res: Response) {
        try {
            const {phone} = req.body;
            const user = (req as UserRequest).user;
            const sender = await DI.em.findOne(Users, {phone});
            const relationship = await DI.em.findOne(Relationships, {
                user1: sender,
                user2: user,
                status: ContactStatus.pending
            });
            if (relationship) {
                relationship.status = ContactStatus.accepted;
                await DI.em.persistAndFlush(relationship);
                res.json({error: false, message: "invite_accepted", relationship});
                return;
            }

            res.status(400).json({error: true, message: "invite_not_found"});
            return;
        } catch (e) {
            logger.error(`acceptInvite: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }

    async rejectInvite(req: Request, res: Response) {
        try {
            const {phone} = req.body;
            const user = (req as UserRequest).user;
            const sender = await DI.em.findOne(Users, {phone});
            const relationship = await DI.em.findOne(Relationships, {
                user1: sender,
                user2: user,
                status: ContactStatus.pending
            });
            if (relationship) {
                relationship.status = ContactStatus.rejected;
                await DI.em.persistAndFlush(relationship);
                res.json({error: false, message: "invite_rejected", relationship});
                return;
            }

            res.status(400).json({error: true, message: "invite_not_found"});
            return;
        } catch (e) {
            logger.error(`rejectInvite: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }

    async getContacts(req: Request, res: Response) {
        try {
            const user = (req as UserRequest).user;
            const relationships = await DI.em.find(Relationships, {
                $or: [{user1: user}, {user2: user}],
                status: ContactStatus.accepted
            }, {populate: true});
            res.json({error: false, relationships});
            return;
        } catch (e) {
            logger.error(`getContacts: ${e}`);
            res.status(500).json({error: true, message: e});
        }
    }
}

export default new ContactController();