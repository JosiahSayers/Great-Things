import mongoose from 'mongoose';

export type PictureDocument = mongoose.Document & PictureInterface;

export type PictureInterface = {
  id?: string;
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

export const Picture = mongoose.model<PictureDocument>('pictures', pictureSchema);

export const mapPictureDocument = (pic: PictureDocument): PictureInterface => (
  {
    id: pic.id,
    ownerId: pic.ownerId,
    createdAt: pic.createdAt,
    href: pic.href,
    height: pic.height,
    width: pic.width,
    format: pic.format
  }
);
