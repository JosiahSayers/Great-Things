import mongoose from 'mongoose';

export type PictureDocument = mongoose.Document & PictureInterface;

export type PictureInterface = {
  id?: string;
  ownerId: string;
  href: string,
  height: number,
  width: number,
  format: string,
  createdAt?: string
}

const pictureSchema = new mongoose.Schema({
  ownerId: String,
  href: String,
  height: Number,
  width: Number,
  format: String,
}, { timestamps: true });

export const Picture = mongoose.model<PictureDocument>('pictures', pictureSchema);
