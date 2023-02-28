import apn from "apn";
import {APN} from "../config/settings";
import * as fs from "fs";
import logger from "../config/logger";

const options = {
    token: {
        key: fs.readFileSync(APN.key),
        keyId: APN.keyId,
        teamId: APN.teamId
    },
    production: false
};

const apnProvider = new apn.Provider(options);

class ApnService {
    async sendNotification(deviceToken: string, body: string) {
        return apnProvider.send(new apn.Notification({
            alert: {
                title: 'Pinta',
                body
            },
            topic: APN.bundleId
        }), deviceToken).then((result) => {
            return {error: false, result};
        }).catch(e => {
            logger.error(`sendNotification: ${e}`);
            return {error: true, message: e};
        })
    }
}

export default new ApnService();