import {Router} from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = Router();

router.get("/getMe", authMiddleware, userController.getMe);
router.post("/sendCode", userController.sendCode);
router.post("/checkCode", userController.checkCode);
router.get("/logout", userController.logout);
router.get("/refresh", userController.refresh);

export default router;