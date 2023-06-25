import axios from "axios";
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

export const downloadMedia = async (fileUrls: string[]) => {
  const publicDir = path.join(process.cwd(),  'public');
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
        writeStream.on('error', reject);
      });

      paths.push(uniqueFilename);
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  }

  return paths;
};
