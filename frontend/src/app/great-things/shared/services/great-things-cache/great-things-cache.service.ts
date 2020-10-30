import { Injectable } from '@angular/core';
import { GreatThing } from '@src/app/shared/models/GreatThing.model';

@Injectable()
export class GreatThingsCacheService {

  private _greatThings: GreatThing[] = [];

  get greatThings(): GreatThing[] {
    return [...this._greatThings];
  }

  addGreatThings(newGreatThings: GreatThing[]): void {
    const newThings = [];
    newGreatThings?.forEach((thing) => {
      const foundIndex = this.getIndexById(thing.id);
      if (foundIndex > -1) {
        this._greatThings[foundIndex] = thing;
      } else {
        newThings.push(thing);
      }
    });
    this._greatThings.push(...newThings);
    this.sortArray();
  }

  removeGreatThing(id: string): void {
    this._greatThings.splice(this.getIndexById(id), 1);
  }

  updateGreatThing(updatedGreatThing: GreatThing): void {
    this._greatThings[this.getIndexById(updatedGreatThing.id)] = updatedGreatThing;
  }

  private getIndexById(id: string): number {
    return this._greatThings.findIndex((gt) => gt.id === id);
  }

  private sortArray(): void {
    this._greatThings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
