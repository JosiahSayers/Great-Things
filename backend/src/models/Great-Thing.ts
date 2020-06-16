import mongoose from 'mongoose';

export type GreatThingDocument = mongoose.Document & {
  text: string;
  createdAt: number;
  lastUpdatedAt: number;
  ownerId: string;
  picture?: GreatThingPicture
};

const greatThingSchema = new mongoose.Schema({
  text: { type: String, text: true },
  createdAt: Number,
  lastUpdatedAt: Number,
  ownerId: String,
  picture: {
    href: String,
    height: Number,
    width: Number,
    format: String,
  }
});

export interface GreatThingPicture {
  href: string;
  height?: number;
  width?: number;
  format: string;
}

export const GreatThing = mongoose.model<GreatThingDocument>('GreatThing', greatThingSchema);
