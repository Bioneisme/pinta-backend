import {NextFunction, Response, Request} from "express";
import logger from "../config/logger";

export default async function logging(req: Request, res: Response, next: NextFunction) {
    logger.info(`[${req.method}] ${req.originalUrl}: ${res.statusCode}`);
    next();
}