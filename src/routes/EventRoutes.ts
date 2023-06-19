import { EventController } from "../controllers/event/event.controller";
import * as express from 'express'

const router = express.Router();
 
const eventController = new  EventController();

 
router.get("/", eventController.getEvents);

 
router.get("/:id", eventController.getEventById);

 
 

 
export default router;
