import {NextFunction, Response, Request} from "express";
import logger from "../config/logger";
import {UserRequest} from "../types";

export async function logging(req: Request, res: Response, next: NextFunction) {
    const ms = new Date().getTime() - (req as UserRequest).locals.getTime();
    logger.info(`${res.socket?.remoteAddress} [${req.method}] ${req.originalUrl}: ${res.statusCode} (${res.statusMessage}) - ${ms}ms`);
}

export function writeDateLogging(req: Request, res: Response, next: NextFunction) {
    (req as UserRequest).locals = new Date();
    next();
}