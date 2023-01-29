import {Request} from "express";
import {Users} from "./entities";

export type UserRequest = Request & { user: Users | undefined, locals: Date };

export enum ContactStatus {
    pending = 0,
    accepted = 1,
    rejected = -1,
}