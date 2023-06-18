import axios from "axios"
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path'
 
export const downloadMedia = async (fileUrls:string[]) => {
    let paths:string[] = [];
    for(let i =0;i<fileUrls.length;i++){
        const fileExtension = path.extname(fileUrls[i]);
 
        const randomString = crypto.randomBytes(6).toString('hex');
        const uniqueFilename = `${Date.now()}_${randomString}${fileExtension}`;
        const filePath = `/home/redwan/personal/coding/project/qaf-bot/public/${uniqueFilename}`;
        const writeStream = fs.createWriteStream(filePath);
        const response = await axios.get(fileUrls[i], { responseType: "stream" });
        response.data.pipe(writeStream);
        
        writeStream.on('finish', () => {
            paths.push(uniqueFilename);
          });
          writeStream.on('error', (error) => {
            console.error('Error saving photo:', error);
          });
    }
    return paths;
  }
