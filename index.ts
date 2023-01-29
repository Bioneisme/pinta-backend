import cors from "cors";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/userRoute";
import {SERVER_PORT} from "./config/settings";
import {config} from "./config/mikro-orm";
import logger from "./config/logger";
import express, {Application} from "express";
import {EntityManager, MikroORM} from "@mikro-orm/core";
import {writeDateLogging, logging} from "./middlewares/loggingMiddleware";
import {init_cache} from "./utils/cache";

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
app.use("/api/users", usersRoutes);
app.use(logging);

app.listen(SERVER_PORT, async () => {
    DI.orm = await MikroORM.init(config);
    DI.em = DI.orm.em.fork();

    init_cache();

    logger.info(`Server Started on port ${SERVER_PORT}`);
});
