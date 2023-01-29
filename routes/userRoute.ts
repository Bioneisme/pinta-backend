import {Router} from "express";
import authMiddleware from "../middlewares/authMiddleware";

import userController from "../controllers/userController";

const router: Router = Router();

router.get("/getMe", authMiddleware, userController.getMe);
router.post("/sendCode", userController.sendCode);
router.post("/checkCode", userController.checkCode);
router.get("/logout", userController.logout);
router.get("/refresh", userController.refresh);

export default router;