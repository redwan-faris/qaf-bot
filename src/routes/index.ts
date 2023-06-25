
import { Router, Request, Response } from "express";
import MediaRouter from './MediaRoutes'
import EventRouter from './EventRoutes'
import BotMessageRouter from './BotMessagesRoutes'
import RoleRoutes from './RoleRoutes'
const routes = Router();
 
 
routes.use("/media", MediaRouter);
routes.use("/events", EventRouter);
routes.use('/bot-messages',BotMessageRouter) 
routes.use('/roles',RoleRoutes) 
export default routes;