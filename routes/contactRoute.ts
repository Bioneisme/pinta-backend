import {Router} from "express";
import authMiddleware from "../middlewares/authMiddleware";

import contactController from "../controllers/contactController";


const router: Router = Router();

router.post("/sendInvite", authMiddleware, contactController.sendInvite);
router.post("/acceptInvite", authMiddleware, contactController.acceptInvite);
router.post("/rejectInvite", authMiddleware, contactController.rejectInvite);
router.get("/getContacts", authMiddleware, contactController.getContacts);

export default router;