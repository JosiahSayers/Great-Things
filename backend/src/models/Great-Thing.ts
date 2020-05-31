import mongoose from 'mongoose';

export type GreatThingDocument = mongoose.Document & {
  text: string;
  createdAt: number;
  lastUpdatedAt: number;
  ownerId: string;
  [key: string]: string | number;
};

const greatThingSchema = new mongoose.Schema({
  text: { type: String, text: true },
  createdAt: Number,
  lastUpdatedAt: Number,
  ownerId: String
});

export const GreatThing = mongoose.model<GreatThingDocument>('GreatThing', greatThingSchema);
