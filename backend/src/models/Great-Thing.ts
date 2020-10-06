import mongoose from 'mongoose';

export type GreatThingDocument = mongoose.Document & GreatThingInterface;

export interface GreatThingInterface {
  id: string;
  text: string;
  ownerId: string;
  pictureId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const greatThingSchema = new mongoose.Schema({
  text: { type: String, text: true },
  ownerId: String,
  pictureId: String
}, { timestamps: true });

export const GreatThing = mongoose.model<GreatThingDocument>('GreatThing', greatThingSchema);
