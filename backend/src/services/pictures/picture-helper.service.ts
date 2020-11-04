import { UploadedFile } from 'express-fileupload';
import sharp from 'sharp';
import { logger, baseLogObject } from '../../util/logger';
import { Request } from 'express';
import { GCP_PHOTO_URL_BASE } from '../../util/environment';
import fs from 'fs';
import { PictureInterface } from '../../models/Picture';
import * as probe from 'probe-image-size';

const processImageAndUpload = async (req: Request): Promise<PictureInterface> => {
  try {
    const fileName = `${req.jwt.id}-${new Date().getTime()}.jpeg`;
    const filepath = `/tmp/${fileName}`;
    const imageSizeData = getImageSizeForResize((<UploadedFile>req.files.image).data);

    const processedImage = await sharp((<UploadedFile>req.files.image).data)
      .resize({
        fit: 'contain',
        height: imageSizeData.height,
        width: imageSizeData.width
      })
      .jpeg()
      .toFile(filepath);

    await req.photoStorage.upload(filepath);
    fs.unlinkSync(filepath);

    return {
      ownerId: req.jwt.id,
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
    throw e;
  }
};

const getImageSizeForResize = (image: Buffer): { width: number, height: number } => {
  const originalImageData = probe.sync(image);
  const { height, width } = originalImageData;
  return {
    width: width > height ? 450 : null,
    height: height > width ? 450 : null
  };
};

const deleteImage = async (fileHref: string, req: Request): Promise<void> => {
  try {
    const pathSegments = fileHref.split('/');
    const filename = pathSegments[pathSegments.length - 1];
    await req.photoStorage.file(filename).delete();
  } catch (e) {
    logger.error({
      msg: 'An error occured while deleting the requested file',
      error: e,
      ...baseLogObject(req)
    });
    throw e;
  }
};

export const PictureHelperService = {
  processImageAndUpload,
  deleteImage
};
