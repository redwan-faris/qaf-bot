
import { Router, Request, Response } from "express";
import MediaRouter from './MediaRoutes'
import EventRouter from './EventRoutes'
import BotMessageRouter from './BotMessagesRoutes'
const routes = Router();
 
 
routes.use("/media", MediaRouter);
routes.use("/events", EventRouter);
routes.use('/bot-messages',BotMessageRouter) 
export default routes;