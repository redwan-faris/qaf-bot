 
import * as express from 'express'
import { BotMessageController } from '../controllers/bot-message/bot-message.controller';
import { checkJwt } from '../middleware/checkJwt';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();
const botMessageController = new  BotMessageController();

 
router.get("/",[checkJwt, checkRole(["superadmin","admin"])] ,  botMessageController.getBotMessages);

router.get("/:id", [checkJwt, checkRole(["superadmin","admin"])] , botMessageController.getEventById);

router.post("/", [checkJwt, checkRole(["superadmin","admin"])] , botMessageController.createBotMessage);

router.patch("/:id", [checkJwt, checkRole(["superadmin","admin"])] , botMessageController.updateBotMessage);

router.delete('/:id',[checkJwt, checkRole(["superadmin","admin"])] , botMessageController.deleteBotMessage);

 
export default router;
