import logger from "../config/logger";
import {DI} from "../index";
import {Notes} from "../entities";
import apnService from "./apnService";
import moment from "moment";

function isTimeToNotify(notifyDate: Date) {
    const now = moment();
    return moment(notifyDate).diff(now, 'minutes') - 6 * 60;
}

class NotificationService {
    async findAndNotifyUsers() {
        try {
            const notes = await DI.em.find(Notes, {
                $or: [
                    {isNotifiedF: false},
                    {isNotifiedS: false}
                ]
            }, {populate: true});
            for (const note of notes) {
                const user = note.recipient;
                const timeToNotify = isTimeToNotify(note.date);
                if (!note.isNotifiedF) {
                    const minutesBeforeNotify = user.minutes || 180;
                    if (timeToNotify < minutesBeforeNotify) {
                        note.isNotifiedF = true;
                        logger.info(`First user notification. \nNote: ${note.id}. ${note.title} \nPhone: ${user.phone}\nDevice Token: ${user.deviceToken}\nMinutes before notify: ${minutesBeforeNotify}\nMinutes left: ${timeToNotify}`);
                        await apnService.sendNotification(user.deviceToken, `Напоминаем о записи "${note.title}"`);
                    }
                } else if (!note.isNotifiedS) {
                    const minutesBeforeNotify = 1;
                    if (timeToNotify < minutesBeforeNotify) {
                        note.isNotifiedS = true;
                        logger.info(`Second user notification. \nNote: ${note.id}. ${note.title} \nPhone: ${user.phone}\nDevice Token: ${user.deviceToken}\nMinutes before notify: ${minutesBeforeNotify}\nMinutes left: ${timeToNotify}`);
                        await apnService.sendNotification(user.deviceToken, `Не забудьте о записи "${note.title}"`);
                    }
                }
                await DI.em.persistAndFlush(note);
            }
        } catch (e) {
            logger.error(`findAndNotifyUsers: ${e}`);
        }
    }
}

export default new NotificationService();