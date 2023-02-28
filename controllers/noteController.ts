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
            if (!title || !date) {
                res.status(400).json({error: true, message: 'title_or_date_not_found'});
                return next();
            }
            const user = (req as UserRequest).user;
            if (!user) {
                res.status(400).json({error: true, message: 'user_not_found'});
                return next();
            }
            if (file) {
                const result = await awsService.uploadFile(file);
                await unlinkFile(file.path);
                const recipientUser = await DI.em.findOne(Users, {id: recipient});
                if (!recipientUser) {
                    res.status(400).json({error: true, message: 'recipient_not_found'});
                    return next();
                }

                const dateObj = moment(date, 'DD/MM/YYYY hh:mm').utc().toDate();
                if (!dateObj) {
                    res.status(400).json({error: true, message: 'date_not_found_or_incorrect_format'});
                    return next();
                }
                const note = DI.em.create(Notes, {
                    sender: user,
                    title,
                    recipient: recipientUser,
                    message,
                    date: dateObj,
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

    async getAudioByKey(req: Request, res: Response, next: NextFunction) {
        try {
            const key = req.params.key
            const readStream = awsService.getFileStream(key);

            readStream.pipe(res);
        } catch (e) {
            logger.error(`getAudioByKey: ${e}`);
            res.status(500).json({error: true, message: e});
            next();
        }
    }

    async getNotesToMe(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as UserRequest).user;
            const notes = await DI.em.find(Notes, {
                recipient: user
            }, {populate: true});
            res.json({error: false, message: "notes_found", notes});
            return next();
        } catch (e) {
            logger.error(`getNotesToMe: ${e}`);
            res.status(500).json({error: true, message: e});
            next();
        }
    }

    async getNotesFromMe(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as UserRequest).user;
            const notes = await DI.em.find(Notes, {
                sender: user
            }, {populate: true});

            res.json({error: false, message: "notes_found", notes});
            return next();
        } catch (e) {
            logger.error(`getNotesFromMe: ${e}`);
            res.status(500).json({error: true, message: e});
            next();
        }
    }
}

export default new NoteController();