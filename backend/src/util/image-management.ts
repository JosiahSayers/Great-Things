import { v2 as cloudinary } from 'cloudinary';
import { UploadedFile } from 'express-fileupload';
import { GreatThingPicture } from '../models/Great-Thing';

export const upload = async (file: UploadedFile): Promise<GreatThingPicture> => {
  const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath);
  
  return {
    href: uploadedFile.secure_url,
    format: uploadedFile.format,
    height: uploadedFile.height,
    width: uploadedFile.width
  };
};
