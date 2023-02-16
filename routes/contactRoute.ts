import {Router} from "express";

import contactController from "../controllers/contactController";


const router: Router = Router();

router.post("/sendInvite", contactController.sendInvite);
router.get("/getInvites", contactController.getInvites);
router.post("/acceptInvite", contactController.acceptInvite);
router.post("/rejectInvite", contactController.rejectInvite);
router.get("/getContacts", contactController.getContacts);

export default router;