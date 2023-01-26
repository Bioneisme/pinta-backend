import {Router} from "express";
import userController from "../controllers/userController";

const router: Router = Router();

router.post("/login", userController.login);
router.post("/validate", userController.validate);
router.post("/register", userController.register);

export default router;