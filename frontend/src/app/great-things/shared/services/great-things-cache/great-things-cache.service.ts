import { Injectable } from '@angular/core';
import { GreatThing } from '@src/app/shared/models/GreatThing.model';

@Injectable()
export class GreatThingsCacheService {

  private _greatThings: GreatThing[] = [];

  get greatThings(): GreatThing[] {
    return [...this._greatThings];
  }

  addGreatThings(newGreatThings: GreatThing[]): void {
    this._greatThings.push(...newGreatThings);
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
