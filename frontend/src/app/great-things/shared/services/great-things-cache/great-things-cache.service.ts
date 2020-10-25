import { Injectable } from '@angular/core';
import { GreatThing } from '@src/app/shared/models/GreatThing.model';

@Injectable()
export class GreatThingsCacheService {

  readonly greatThings: GreatThing[] = [];

  updateGreatThing(updatedGreaThing: GreatThing): void {
    this.greatThings[this.greatThings.findIndex((gt) => gt.id === updatedGreaThing.id)] = updatedGreaThing;
  }

  addGreatThings(newGreatThings: GreatThing[]): void {
    this.greatThings.push(...newGreatThings);
  }
}
