import { GreatThingFromApi, GreatThingsPictureFromApi } from './api-responses/great-thing.interface';
import { Picture } from './Picture.model';

export class GreatThing {

  createdAt: Date;
  lastUpdatedAt: Date;

  constructor(
    public id: string,
    public text: string,
    private createdAtTime: number,
    private lastUpdatedAtTime: number,
    public picture?: Picture
  ) {
    this.createdAt = new Date(createdAtTime);
    this.lastUpdatedAt = new Date(lastUpdatedAtTime);
  }
}
