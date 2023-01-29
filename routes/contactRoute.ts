import {Router} from "express";
import authMiddleware from "../middlewares/authMiddleware";

import contactController from "../controllers/contactController";


const router: Router = Router();

router.post("/addContact", authMiddleware, contactController.addContact);
router.get("/getContacts", authMiddleware, contactController.getContacts);

export default router;