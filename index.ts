import cors from "cors";
import cookieParser from "cookie-parser";
import usersRoute from "./routes/userRoute";
import contactRoute from "./routes/contactRoute";
import noteRoute from "./routes/noteRoute";
import {SERVER_PORT} from "./config/settings";
import {config} from "./config/mikro-orm";
import logger from "./config/logger";
import express, {Application} from "express";
import {EntityManager, MikroORM} from "@mikro-orm/core";
import {writeDateLogging, logging} from "./middlewares/loggingMiddleware";
import {init_cache, redis} from "./utils/cache";
import authMiddleware from "./middlewares/authMiddleware";
import {notesCron} from "./utils/crons";

const app: Application = express();

export const DI = {} as {
    orm: MikroORM,
    em: EntityManager
};

app.use(express.json());
app.use(cors({
    credentials: true
}));
app.use(cookieParser());
app.use(writeDateLogging);
app.use("/api/users", usersRoute);
app.use("/api/contacts", authMiddleware, contactRoute);
app.use("/api/notes", authMiddleware, noteRoute);
app.use(logging);

app.listen(SERVER_PORT, async () => {
    DI.orm = await MikroORM.init(config);
    DI.em = DI.orm.em.fork();

    init_cache();
    notesCron.start();

    logger.info(`Server Started on port ${SERVER_PORT}`);
});

process.once('SIGINT', () => {
    notesCron.stop();
    logger.info(`Server Stopped by SIGINT process`);
    DI.orm.close().then(() => logger.info(`PostgreSQL was closed`));
    redis.quit().then(() => logger.info(`Redis was closed`));
});
process.once('SIGTERM', () => {
    notesCron.stop();
    logger.info(`Server Stopped by SIGTERM process`);
    DI.orm.close().then(() => logger.info(`PostgreSQL was closed`));
    redis.quit().then(() => logger.info(`Redis was closed`));
});
