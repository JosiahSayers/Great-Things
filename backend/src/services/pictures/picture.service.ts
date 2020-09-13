import { PictureDocument, Picture, PictureInterface } from '../../models/Picture';
import { Request } from 'express';
import { baseLogObject, logger } from '../../util/logger';
import { PictureHelperService as helper } from './picture-helper.service';

const findById = async (id: string): Promise<PictureDocument> => {
  return Picture.findById(id);
};

const mapPicture = (pic: PictureDocument): PictureInterface => {
  return {
    id: pic.id,
    ownerId: pic.ownerId,
    href: pic.href,
    height: pic.height,
    width: pic.width,
    format: pic.format
  };
};

const uploadImage = async (req: Request): Promise<PictureInterface> => {
  try {
    if (!req.files.image) {
      logger.debug({
        msg: 'User tried to upload a file without sending it in the "image" form field',
        ...baseLogObject(req)
      });
      throw new Error('400');
    } else if (Array.isArray(req.files.image)) {
      logger.debug({
        msg: 'User tried to upload multiple files',
        ...baseLogObject(req)
      });
      throw new Error('400');
    } else {
      const picture = await helper.processImageAndUpload(req);
      const pictureDocument = await new Picture(picture).save();
      logger.info({
        msg: 'User successfully uploaded an image',
        ...baseLogObject(req)
      });
      return mapPicture(pictureDocument);
    }
  } catch (e) {
    if (e.message !== '400') {
      logger.error({
        msg: 'User encountered an error while trying to upload an image',
        error: e,
        ...baseLogObject(req)
      });
      e.message = '500';
    }

    throw e;
  }
};

const deleteImage = async (pictureId: string, req: Request): Promise<void> => {
  const deletedPicture = await Picture.findByIdAndDelete({ _id: pictureId });
  await helper.deleteImage(deletedPicture.href, req);
  return;
};

export const pictureService = {
  findById,
  mapPicture,
  uploadImage,
  deleteImage
};
