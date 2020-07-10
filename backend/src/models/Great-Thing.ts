import mongoose from 'mongoose';

export type GreatThingDocument = mongoose.Document & {
  text: string;
  createdAt: number;
  lastUpdatedAt: number;
  ownerId: string;
  pictureId?: string;
};

const greatThingSchema = new mongoose.Schema({
  text: { type: String, text: true },
  createdAt: Number,
  lastUpdatedAt: Number,
  ownerId: String,
  pictureId: String
});

export const GreatThing = mongoose.model<GreatThingDocument>('GreatThing', greatThingSchema);
