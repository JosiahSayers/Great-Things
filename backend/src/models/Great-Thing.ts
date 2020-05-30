import mongoose from 'mongoose';

export type GreatThingDocument = mongoose.Document & {
  text: string;
  creationDate: number;
  ownerId: string;
};

const greatThingSchema = new mongoose.Schema({
  text: String,
  creationDate: Number,
  ownerId: String
});

export const GreatThing = mongoose.model<GreatThingDocument>('GreatThing', greatThingSchema);
