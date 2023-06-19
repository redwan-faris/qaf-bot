 
import * as express from 'express'
import { BotMessageController } from '../controllers/bot-message/bot-message.controller';

const router = express.Router();
const botMessageController = new  BotMessageController();

 
router.get("/", botMessageController.getBotMessages);

router.get("/:id", botMessageController.getEventById);

router.post("/", botMessageController.createBotMessage);

router.patch("/:id", botMessageController.updateBotMessage);

router.delete('/:id',botMessageController.deleteBotMessage);

 
export default router;
