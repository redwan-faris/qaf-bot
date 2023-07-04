import axios from "axios";
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { BotMessage } from "../entities/BotMessage";
import sharp from 'sharp';

export const downloadMedia = async (fileUrls: string[]) => {
  const publicDir = path.join(process.cwd(),  'public/normal');
  const paths: string[] = [];

  for (let i = 0; i < fileUrls.length; i++) {
    try {
      const fileExtension = path.extname(fileUrls[i]);
      const randomString = crypto.randomBytes(6).toString('hex');
      const uniqueFilename = `${Date.now()}_${randomString}${fileExtension}`;
      const filePath = path.join(publicDir, uniqueFilename);
      const writeStream = fs.createWriteStream(filePath);
      const response = await axios.get(fileUrls[i], { responseType: "stream" });
      response.data.pipe(writeStream);
      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.  on('error', reject);
      });

      paths.push(uniqueFilename);
      generateThumbnail(uniqueFilename,640)
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  }

  return paths;
};

export const  convertToHash = (messages: BotMessage[]) => {

  let hash:any = {};
  for(let i =0;i<messages.length;i++){
    hash[messages[i]['messageKey']] = messages[i]['messageContent']
  } 
  return hash;

}


export const generateThumbnail = (imageName:string,thumbnailSize:number) => {
  const thumbPath = path.join(process.cwd(),  'public/thumb',imageName);
  const filePath = path.join(process.cwd(),  'public/normal',imageName);
  return new Promise((resolve, reject) => {
    sharp(filePath)
      .resize({
        width:thumbnailSize,
        height:thumbnailSize,
        fit:sharp.fit.fill
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
