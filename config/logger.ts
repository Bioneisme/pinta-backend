import moment from "moment";
import {createLogger, transports, format} from "winston";
import TelegramLogger from "winston-telegram";
import {BOT_TOKEN, LOGS_CHAT_ID} from "./settings";


const formatter = format((info) => {
    const {level} = info;
    info.level = `(${moment().utc().format('DD.MM.YYYY, HH:mm:ss')}) [${level}]`;
    return info;
})();


const logger = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                formatter,
                format.simple()
            )
        }),
        new TelegramLogger({
            token: BOT_TOKEN,
            chatId: +LOGS_CHAT_ID,
            batchingDelay: 1000
        })
    ]
});

export default logger;