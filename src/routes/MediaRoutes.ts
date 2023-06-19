import { MediaController } from "../controllers/Media/media.controller";
import * as express from 'express'

const router = express.Router();

const mediaController = new  MediaController();

 
router.get("/", mediaController.getMedia);

 
router.get("/:id", mediaController.getMediaById);

 
 

 
export default router;
