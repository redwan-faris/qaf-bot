import { EventController } from "../controllers/event/event.controller";
import * as express from 'express'
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();
 
const eventController = new  EventController();

 
router.get("/", [checkJwt, checkRole(["superadmin","admin"])] , eventController.getEvents);

 
router.get("/:id", [checkJwt, checkRole(["superadmin","admin"])] , eventController.getEventById);

router.delete("/:id", [checkJwt, checkRole(["superadmin","admin"])] , eventController.deleteBotMessage);

 
 

 
 
export default router;
