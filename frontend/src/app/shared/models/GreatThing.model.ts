import { Picture } from './Picture.model';

export class GreatThing {

  createdAt: Date;
  lastUpdatedAt: Date;

  constructor(
    public id: string,
    public text: string,
    private createdAtTime: string,
    private lastUpdatedAtTime: string,
    public picture?: Picture
  ) {
    this.createdAt = new Date(createdAtTime);
    this.lastUpdatedAt = new Date(lastUpdatedAtTime);
  }
}
