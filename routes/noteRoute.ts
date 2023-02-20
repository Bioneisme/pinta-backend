import {Router} from "express";
import authMiddleware from "../middlewares/authMiddleware";
import multer from "multer";

import noteController from "../controllers/noteController";

const upload = multer({ dest: 'uploads/' })

const router: Router = Router();

router.post("/createNote", upload.single('audio'), noteController.createNote);
router.get("/getNote/:keys", noteController.getNote);

export default router;