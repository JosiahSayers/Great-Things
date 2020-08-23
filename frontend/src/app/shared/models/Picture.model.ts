import { GreatThingsPictureFromApi } from './api-responses/great-thing.interface';

export class Picture {
  createdAt: Date;

  constructor(
    public id: string,
    private createdAtTime: number,
    public href: string,
    public height: number,
    public width: number,
    public format: string
  ) {
    this.createdAt = new Date(createdAtTime);
  }
}
