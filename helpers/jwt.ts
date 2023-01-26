import {JWT_SECRET} from "../config/settings";
import jwt, {JwtPayload} from "jsonwebtoken";

type Decoded = { id: string } | string | JwtPayload;

export function generateJWT(id: number): string {
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn: "1d",
    });
}

export function verifyJWT(token: string): Decoded {
    return jwt.verify(
        token,
        JWT_SECRET
    );
}