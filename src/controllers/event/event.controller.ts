import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express from "express";
import { Event } from "../../entities/Event";
import { Media } from "../../entities/Media";
import { EventService } from "./event.service";

const mediaService = new EventService();
// TODO make helper to handle response
export class EventController {

  async getEvents(req: express.Request, res: express.Response) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1; // Current page number, default to 1 if not provided
      const limit = parseInt(req.query.limit as string, 10) || 10; // Number of records per page, default to 10 if not provided

      const events= await mediaService.getAllEvents(page,limit);
      res.json({
        success: true,
        status: 200,
        count:events.count,
        data: events.events,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errMessage: "Internal Server Error",
      });
    }
  }

  async getEventById(req: express.Request, res: express.Response) {
    try {
      const eventId: number = +req.params.id;
      const event = await mediaService.getEventById(eventId);
      res.status(200).json({
        success: true,
        status: 200,
        data: event,
      });
    } catch (error: any) {
      res.status(404).json({
        status: 404,
        error: error.message,
        success: false
      });
    }
  }


}
