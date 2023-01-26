import logger from "../config/logger";
import {DI} from "../index";
import {generateJWT, verifyJWT} from "../helpers/jwt";
import {Request, Response} from "express";
import {UserRequest} from "../types";
import bcryptjs from "bcryptjs";
import {Users} from "../entities";

class UserController {
    async register(req: Request, res: Response) {
        try {
            // const {phone} = req.body;
            //
            // if (!email || !password) {
            //     res.status(400).json({error: true, message: "Missing email or password"});
            //     return;
            // }
            //
            // const existingUser = await DI.em.findOne(Users, {phone});
            //
            // if (existingUser) {
            //     res.status(400).json({error: true, message: "User already exists"});
            //     return;
            // }
            //
            // const slat = bcryptjs.genSaltSync(10);
            // const hashedPassword = await bcryptjs.hash(password, slat);
            //
            // const user = DI.em.create(Users, {
            //     email,
            //     password: hashedPassword,
            //     full_name,
            //     date_of_birth,
            //     region,
            //     city,
            //     specialization
            // });
            //
            // await DI.em.persistAndFlush(user);
            //
            // if (!user) {
            //     res.status(500).json({error: true, message: "Something went wrong"});
            //     return;
            // }
            //
            // res.status(201).send({...user, token: generateJWT(user.id)});
        } catch (e) {
            logger.error(`Register: ${e}`);
        }
    }

    async login(req: Request, res: Response) {
        try {
            // const {email, password} = req.body;
            //
            // if (!email || !password) {
            //     res.status(400).json({error: true, message: "Missing email or password"});
            //     return;
            // }
            //
            // const user = await DI.em.findOne(Users, {email});
            //
            // if (!user) {
            //     res.status(400).json({error: true, message: "User not found"});
            //     return;
            // }
            //
            // const isPasswordValid = await bcryptjs.compare(password, user.password);
            //
            // if (!isPasswordValid) {
            //     res.status(400).json({error: true, message: "Invalid password"});
            //     return;
            // }
            //
            // res.status(200).send({...(user), token: generateJWT(user.id)});
        } catch (e) {
            logger.error(`Login: ${e}`);
        }
    }


    async validate(req: Request, res: Response) {
        try {
            const {token} = req.body;
            const decoded = verifyJWT(token);

            const id: number = (decoded as { id: number }).id;

            const user = await DI.em.findOne(Users, {id});
            if (!user) return res.status(400).json({error: true, message: "User not found"});
            (req as UserRequest).user = user;

            return res.status(200).json({...(user), token: generateJWT(user.id)});
        } catch (e) {
            logger.error(`getCurrentUser: ${e}`);
        }
    }
}

export default new UserController();