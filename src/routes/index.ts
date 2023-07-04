
import { Router, Request, Response } from "express";
import MediaRouter from './MediaRoutes'
import EventRouter from './EventRoutes'
import BotMessageRouter from './BotMessagesRoutes'
import RoleRoutes from './RoleRoutes'
import UserRoutes from './UserRoutes'
import AuthRoutes from './AuthRoutes'
import MemberRoutes from './MemberRoutes'

const routes = Router();
 
 
routes.use("/media", MediaRouter);
routes.use("/events", EventRouter);
routes.use('/bot-messages',BotMessageRouter) 
routes.use('/roles',RoleRoutes) 
routes.use('/users',UserRoutes) 
routes.use('/auth',AuthRoutes) 
routes.use('/members',MemberRoutes)
export default routes;