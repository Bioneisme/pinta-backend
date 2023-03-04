import {NextFunction, Response, Request} from "express";
import logger from "../config/logger";

export function logging(req: Request, res: Response, next: NextFunction) {
    const startTimer = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - startTimer;
        logger.info(`(${req.headers['x-forwarded-for'] || req.socket.remoteAddress || null}) [${req.method}] ` +
            `${req.originalUrl}: ${res.statusCode} ${JSON.stringify(req.body)} ${req.file ? `File: ${req.file.originalname} (${req.file.size})` : ''}` +
            ` - ${ms}ms`);
    });
    next();
}