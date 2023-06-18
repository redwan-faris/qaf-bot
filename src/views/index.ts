
import { Router, Request, Response } from "express";
import MediaRouter from './MediaRoutes'
import EventRouter from './EventRoutes'
const routes = Router();
 
 
routes.use("/media", MediaRouter);
routes.use("/events", EventRouter);


export default routes;