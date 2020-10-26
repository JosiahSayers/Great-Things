import { Injectable } from '@angular/core';
import { GreatThing } from '@src/app/shared/models/GreatThing.model';

@Injectable()
export class GreatThingsCacheService {

  readonly greatThings: GreatThing[] = [];

  updateGreatThing(updatedGreatThing: GreatThing): void {
    this.greatThings[this.getIndexById(updatedGreatThing.id)] = updatedGreatThing;
  }

  removeGreatThing(id: string): void {
    this.greatThings.splice(this.getIndexById(id), 1);
  }

  addGreatThings(newGreatThings: GreatThing[]): void {
    this.greatThings.push(...newGreatThings);
    this.sortArray();
  }

  private getIndexById(id: string): number {
    return this.greatThings.findIndex((gt) => gt.id === id);
  }

  private sortArray(): void {
    this.greatThings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
