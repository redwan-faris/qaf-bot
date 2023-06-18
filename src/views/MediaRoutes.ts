import { MediaController } from "../controllers/Media/media.controller";

const router = require("express").Router();

//include the Location controller class
const mediaController = new  MediaController();

 
router.get("/", mediaController.getMedia);

 
router.get("/:id", mediaController.getMediaById);

 
 

 
export default router;
