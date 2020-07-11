import { PictureInterface } from '../models/Picture';
import { GreatThingInterface } from '../models/Great-Thing';

export interface GreatThingResponse {
  greatThings: MappedResponseObject[];
}

export interface MappedResponseObject extends GreatThingInterface {
  picture?: PictureInterface
}
