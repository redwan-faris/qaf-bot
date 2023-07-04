import axios from "axios";
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { BotMessage } from "../entities/BotMessage";
import sharp from 'sharp';

export const downloadMedia = async (fileUrls: string[]) => {

  const paths: string[] = [];
  

  for (let i = 0; i < fileUrls.length; i++) {
    try {
      const fileExtension = path.extname(fileUrls[i]);
      let type = findType(fileExtension);
      const publicDir = path.join(process.cwd(), `public/${type}/normal`);
 
      if (type != -1) {
        const randomString = crypto.randomBytes(6).toString('hex');
        const uniqueFilename = `${Date.now()}_${randomString}${fileExtension}`;
        const filePath = path.join(publicDir, uniqueFilename);
        const writeStream = fs.createWriteStream(filePath);
        const response = await axios.get(fileUrls[i], { responseType: "stream" });
        response.data.pipe(writeStream);
        await new Promise<void>((resolve, reject) => {
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });
        if (type == 'pictures') {
          generateThumbnail(uniqueFilename, 640);
          paths.push(uniqueFilename);
        }

      }

    } catch (error) {
      console.error('Error saving photo:', error);
    }
  }

  return paths;
};

export const convertToHash = (messages: BotMessage[]) => {

  let hash: any = {};
  for (let i = 0; i < messages.length; i++) {
    hash[messages[i]['messageKey']] = messages[i]['messageContent']
  }
  return hash;

}


export const generateThumbnail = (imageName: string, thumbnailSize: number) => {
  const thumbPath = path.join(process.cwd(), 'public/pictures/thumb', imageName);
  const filePath = path.join(process.cwd(), 'public/pictures/normal', imageName);
  return new Promise((resolve, reject) => {
    sharp(filePath)
      .resize({
        width: thumbnailSize,
        height: thumbnailSize,
        fit: sharp.fit.fill
      })
      .toFile(thumbPath, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(thumbPath);
        }
      });
  });
};



const findType = (fileExt: string) => {


  const videoExtensions = [
    ".mp4",
    ".mov",
    ".avi",
    ".wmv",
    ".mkv",
    ".flv",
    ".webm",
    ".m4v",
    ".3gp",
    ".mpeg"
  ];



  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.heic', '.heif', '.arw','.cr2','.cr3'];

  if (videoExtensions.includes(fileExt)) {
    return 'videos';
  }

  if (imageExtensions.includes(fileExt)) {
    return 'pictures';
  }

  return -1;


}