import { TestBed } from '@angular/core/testing';
import { GreatThing } from '@src/app/shared/models/GreatThing.model';

import { GreatThingsCacheService } from './great-things-cache.service';

describe('GreatThingsCacheService', () => {
  let service: GreatThingsCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GreatThingsCacheService]
    });
    service = TestBed.inject(GreatThingsCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addGreatThings', () => {
    it('adds the passed in GreatThings to the cache', () => {
      expect(service.greatThings).toEqual([]);
      service.addGreatThings([buildGreatThing({}), buildGreatThing({})]);
      expect(service.greatThings).toEqual([buildGreatThing({}), buildGreatThing({})]);
    });

    it('sorts the cache by the createdAt times of each GreatThing', () => {
      const currentTime = new Date();
      const oldTime = new Date();
      oldTime.setHours(currentTime.getHours() - 3);

      const current = buildGreatThing({});
      const older = buildGreatThing({
        createdAtString: oldTime.toISOString()
      });

      service.addGreatThings([older, current]);
      expect(service.greatThings).toEqual([current, older]);
    });
  });

  describe('removeGreatThing', () => {
    it('removes the GreatThing with the passed in ID', () => {
      service.addGreatThings([buildGreatThing({ id: 'TEST' }), buildGreatThing({ id: 'REMOVE ME' })]);
      service.removeGreatThing('REMOVE ME');
      expect(service.greatThings).toEqual([buildGreatThing({ id: 'TEST' })]);
    });
  });

  describe('updateGreatThing', () => {
    it('finds the passed in GreatThing and updates it', () => {
      const current = buildGreatThing({ id: 'ID' });
      const updated = buildGreatThing({ id: 'ID', text: 'UPDATED' });
      const other = buildGreatThing({});
      service.addGreatThings([current, other]);
      service.updateGreatThing(updated);
      expect(service.greatThings).toEqual([updated, other]);
    });
  });

  function buildGreatThing(params: Partial<GreatThing> & { createdAtString?: string, lastUpdatedString?: string }): GreatThing {
    return new GreatThing(
      params.id ?? '',
      params.text ?? '',
      params.createdAtString || new Date().toISOString(),
      params.lastUpdatedString || new Date().toISOString()
    );
  }
});
