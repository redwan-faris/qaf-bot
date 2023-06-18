import { EventController } from "../controllers/event/event.controller";
import { MediaController } from "../controllers/Media/media.controller";

const router = require("express").Router();

//include the Location controller class
const eventController = new  EventController();

 
router.get("/", eventController.getEvents);

 
router.get("/:id", eventController.getEventById);

 
 

 
export default router;
