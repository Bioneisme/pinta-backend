import {createClient} from "redis";
import {REDIS} from "../config/settings";
import logger from "../config/logger";

export const init_cache = () => {};

export const redis = createClient({url: `redis://:${REDIS.password}@${REDIS.host}:${REDIS.port}`});

redis.connect().then(() => {
    logger.info(`Redis: Connected ✅ `);
});

redis.on('error', (err) => {
    logger.error(`Redis: ${err.message}`);
    throw err.message;
});