import { MediaController } from "../controllers/Media/media.controller";
import * as express from 'express'
import { checkRole } from "../middleware/checkRole";
import { checkJwt } from "../middleware/checkJwt";
 

const router = express.Router();

const mediaController = new MediaController();


router.get("/", [checkJwt, checkRole(["superadmin", "admin"])], mediaController.getMedia);


router.get("/:id", [checkJwt, checkRole(["superadmin", "admin"])], mediaController.getMediaById);

router.get('/download/:filePath' , mediaController.downloadMedia);



export default router;
