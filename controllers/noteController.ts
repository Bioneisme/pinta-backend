import {Request, Response, NextFunction} from "express";
import logger from "../config/logger";
import awsService from "../services/awsService";
import * as util from "util";
import * as fs from "fs";
import {DI} from "../index";
import {Notes, Users} from "../entities";
import moment from "moment";
import {UserRequest} from "../types";


const unlinkFile = util.promisify(fs.unlink);

class NoteController {
    async createNote(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const {title, message, recipient, date} = req.body;
            const user = (req as UserRequest).user;
            if (file) {
                const result = await awsService.uploadFile(file);
                await unlinkFile(file.path);

                const sender = await DI.em.findOne(Users, {id: user?.id});
                const recipientUser = await DI.em.findOne(Users, {id: recipient});
                if (!recipientUser || !sender) {
                    res.status(400).json({error: true, message: 'sender_or_recipient_not_found'});
                    return next();
                }

                const note = DI.em.create(Notes, {
                    sender,
                    title,
                    recipient: recipientUser,
                    message,
                    date: moment(date).toDate(),
                    audio_key: result.Key
                });

                await DI.em.persistAndFlush(note);
                res.json({error: false, note});
            } else {
                res.status(400).send({error: true, message: "no_file_uploaded"});
            }
            return next();
        } catch (e) {
            logger.error(`createNote: ${e}`);
            res.status(500).json({error: true, message: e});
            next();
        }
    }

    async getNote(req: Request, res: Response, next: NextFunction) {
        try {
            const key = req.params.key
            const readStream = awsService.getFileStream(key);

            readStream.pipe(res)
        } catch (e) {
            logger.error(`getNote: ${e}`);
            res.status(500).json({error: true, message: e});
            next();
        }
    }
}

export default new NoteController();