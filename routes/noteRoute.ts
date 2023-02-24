import {Router} from "express";
import multer from "multer";

import noteController from "../controllers/noteController";

const upload = multer({ dest: 'uploads/' })

const router: Router = Router();

router.post("/createNote", upload.single('audio'), noteController.createNote);
router.get("/getNotesToMe", noteController.getNotesToMe);
router.get("/getNotesFromMe", noteController.getNotesFromMe);
router.get("/getAudioByKey/:key", noteController.getAudioByKey);

export default router;