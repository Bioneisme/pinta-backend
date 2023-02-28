import {Router} from "express";
import authMiddleware from "../middlewares/authMiddleware";

import userController from "../controllers/userController";
import adminController from "../controllers/adminController";

const router: Router = Router();

router.get("/getMe", authMiddleware, userController.getMe);
router.patch("/changeNotifyMinutes", authMiddleware, userController.changeNotifyMinutes);
router.post("/sendCode", userController.sendCode);
router.post("/checkCode", userController.checkCode);
router.get("/logout", userController.logout);
router.get("/refresh", userController.refresh);

// TODO: Delete
router.get("/getUsers", adminController.getUsers);

export default router;