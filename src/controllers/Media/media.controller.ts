import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express from "express";
import { Media } from "../../entities/Media";
import { MediaService } from "./media.service";

export class MediaConroller {
  mediaService: MediaService;
  constructor() {
    this.mediaService = new MediaService();
  }
  async getMedia(req: express.Request, res: express.Response) {
    try {
      const medias: Media[] = await this.mediaService.getAllMedia();
      res.json({
        success: true,
        status :200,
        data: medias,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errMessage: "Intrnal Server Error",
      });
    }
  }

  async getMediaById(req: express.Request, res: express.Response) {
    try {
      const mediaId: number = +req.params.id;

      const media = await this.mediaService.getMediaById(mediaId);
      res.status(200).json({
        success: true,
        status :200,
        data: media,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errMessage: "Intrnal Server Error",
      });
    }
  }

  async addMedia(req: express.Request, res: express.Response) {
    try {
   
      const media = plainToClass(Media, req.body);
   
      const errors = await validate(media);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          status :400,
          error: errors,
        });
      }

      const newMedia = await this.mediaService.addMedia(media);
      res.status(201).json({
        success: true,
        status :201,
        data: newMedia,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errMessage: "Intrnal Server Error",
      });
    }
  }
}
