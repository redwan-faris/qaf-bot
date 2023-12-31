import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express from "express";
import path from "path";
import { Media } from "../../entities/Media";
import { MediaService } from "./media.service";

const mediaService = new MediaService();
// TODO make helper to handle response
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
    } catch (error:any) {
      res.status(404).json({
        status: 404,
        error: error.message,
        success: false
      });
    }
  }

  downloadMedia(req: express.Request, res: express.Response) {
    const filePath = req.params.filePath; 
    const type = req.query.type;
    const version = req.query.version;
    const publicDir = path.join(process.cwd(),  `public/${type}/${version}`,filePath);
    res.set("Content-Disposition", "inline");
    res.sendFile(publicDir, (err) => {
      if (err) { 
        console.error('File download error:', err);
        res.status(404).json({
          status: 404,
          error: "File not found",
          success: false
        });
      }
    });
  }
   
}
