import mongoose from 'mongoose';

export type GreatThingDocument = mongoose.Document & {
  text: string;
  createdAt: number;
  lastUpdatedAt: number;
  ownerId: string;
};

const greatThingSchema = new mongoose.Schema({
  text: String,
  createdAt: Number,
  lastUpdatedAt: Number,
  ownerId: String
});

export const GreatThing = mongoose.model<GreatThingDocument>('GreatThing', greatThingSchema);
