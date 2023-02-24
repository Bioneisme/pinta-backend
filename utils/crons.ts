import cron from "node-cron";
import {NOTES_CRON} from "../config/settings";
import notificationService from "../services/notificationService";

export const notesCron = cron.schedule(NOTES_CRON, async () => {
    await notificationService.findAndNotifyUsers();
});
