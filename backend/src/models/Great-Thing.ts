import mongoose from 'mongoose';

export type GreatThingDocument = mongoose.Document & GreatThingInterface;

export interface GreatThingInterface {
  id: string;
  text: string;
  ownerId: string;
  pictureId?: string;
}

const greatThingSchema = new mongoose.Schema({
  text: { type: String, text: true },
  createdAt: Number,
  lastUpdatedAt: Number,
  ownerId: String,
  pictureId: String
}, { timestamps: true });

export const GreatThing = mongoose.model<GreatThingDocument>('GreatThing', greatThingSchema);
