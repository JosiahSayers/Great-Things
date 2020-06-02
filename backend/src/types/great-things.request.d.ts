import { GreatThingPicture } from '../models/Great-Thing';

export interface GreatThingRequest {
  text: string;
  picture?: GreatThingPicture;
}
