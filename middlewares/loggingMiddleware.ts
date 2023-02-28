import {NextFunction, Response, Request} from "express";
import logger from "../config/logger";
import {UserRequest} from "../types";

export async function logging(req: Request, res: Response, next: NextFunction) {
    const ms = new Date().getTime() - (req as UserRequest).locals.getTime();
    console.log(req.file)
    logger.info(`(${req.headers['x-forwarded-for'] || req.socket.remoteAddress || null}) [${req.method}] ` +
        `${req.originalUrl}: ${res.statusCode} ${JSON.stringify(req.body)} ${req.file ? `File: ${req.file.originalname} (${req.file.size})` : null}` +
        ` - ${ms}ms`);
}

export function writeDateLogging(req: Request, res: Response, next: NextFunction) {
    (req as UserRequest).locals = new Date();
    next();
}