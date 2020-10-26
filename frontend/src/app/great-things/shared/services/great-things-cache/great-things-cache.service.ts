import { Injectable } from '@angular/core';
import { GreatThing } from '@src/app/shared/models/GreatThing.model';

@Injectable()
export class GreatThingsCacheService {

  readonly greatThings: GreatThing[] = [];

  updateGreatThing(updatedGreaThing: GreatThing): void {
    this.greatThings[this.getIndexById(updatedGreaThing.id)] = updatedGreaThing;
  }

  removeGreatThing(id: string): void {
    this.greatThings.splice(this.getIndexById(id), 1);
  }

  addGreatThings(newGreatThings: GreatThing[]): void {
    this.greatThings.push(...newGreatThings);
  }

  private getIndexById(id: string): number {
    return this.greatThings.findIndex((gt) => gt.id === id);
  }
}
