import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express from "express";
import { Media } from "../../entities/Media";
import { MediaService } from "./media.service";

const mediaService = new MediaService();

export class MediaController {
 
  async getMedia(req: express.Request, res: express.Response) {
    try {
      const medias: Media[] = await mediaService.getAllMedia();
      res.json({
        success: true,
        status: 200,
        data: medias,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errMessage: "Internal Server Error",
      });
    }
  }

  async getMediaById(req: express.Request, res: express.Response) {
    try {
      const mediaId: number = +req.params.id;
      const media = await mediaService.getMediaById(mediaId);
      res.status(200).json({
        success: true,
        status: 200,
        data: media,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errMessage: "Internal Server Error",
      });
    }
  }

   
}