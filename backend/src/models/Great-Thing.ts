import mongoose from 'mongoose';

export type GreatThingDocument = mongoose.Document & GreatThingInterface;

export interface GreatThingInterface {
  id: string;
  text: string;
  ownerId: string;
  pictureId?: string;
  createdAt?: string;
  updatedAt?: string;
  people: Person[];
  textWithEntities: string;
}

export interface Person {
  name: string;
  type: string;
  referencesInText: string[];
}

const greatThingSchema = new mongoose.Schema({
  text: { type: String, text: true },
  ownerId: String,
  pictureId: String,
  people: Array,
  textWithEntities: String
}, { timestamps: true });

export const GreatThing = mongoose.model<GreatThingDocument>('GreatThing', greatThingSchema);
