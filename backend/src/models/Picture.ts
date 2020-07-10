import mongoose from 'mongoose';

export type PictureDocument = mongoose.Document & PictureInterface;

export type PictureInterface = {
  ownerId: string;
  createdAt: number;
  href: string,
  height: number,
  width: number,
  format: string,
}

const pictureSchema = new mongoose.Schema({
  ownerId: String,
  createdAt: Number,
  href: String,
  height: Number,
  width: Number,
  format: String,
});

export const Picture = mongoose.model<PictureDocument>('Picture', pictureSchema);
