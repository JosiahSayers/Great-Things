import { UploadedFile } from 'express-fileupload';
import sharp from 'sharp';
import { logger, baseLogObject } from './logger';
import { Request } from 'express';
import { GCP_PHOTO_URL_BASE } from './environment';
import fs from 'fs';
import { PictureInterface } from '../models/Picture';

export const processImageAndUpload = async (file: UploadedFile, req: Request): Promise<PictureInterface> => {
  try {
    const fileName = `${req.jwt.id}-${new Date().getTime()}.jpeg`;
    const filepath = `/tmp/${fileName}`;

    const processedImage = await sharp(file.data)
      .resize(450, 450, {
        fit: 'contain'
      })
      .jpeg()
      .toFile(filepath);

    await req.photoStorage.upload(filepath);
    fs.unlinkSync(filepath);

    return {
      ownerId: req.jwt.id,
      createdAt: new Date().getTime(),
      href: GCP_PHOTO_URL_BASE + fileName,
      format: processedImage.format,
      width: processedImage.width,
      height: processedImage.height
    };
  } catch (e) {
    logger.error({
      msg: 'An error occured while processing and uploading an image',
      error: e,
      ...baseLogObject(req)
    });
    return;
  }
};
