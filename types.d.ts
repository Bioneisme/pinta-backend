import {Request} from "express";
import {Users} from "./entities";

export type UserRequest = Request & {user: Users | undefined};