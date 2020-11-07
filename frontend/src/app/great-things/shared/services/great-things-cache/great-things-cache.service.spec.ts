import { TestBed } from '@angular/core/testing';
import { GreatThing } from '@src/app/shared/models/GreatThing.model';
import { AuthService } from '@src/app/shared/services/auth/auth.service';
import { spyOnClass } from '@src/app/utils/testing/helper-functions';
import { Spied } from '@src/app/utils/testing/spied.interface';

import { GreatThingsCacheService } from './great-things-cache.service';

describe('GreatThingsCacheService', () => {
  let service: GreatThingsCacheService;
  let auth: Spied<AuthService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GreatThingsCacheService,
        {
          provide: AuthService,
          useFactory: () => auth = spyOnClass(AuthService, [
            'onAuthStateChanged'
          ])
        }
      ]
    });
    service = TestBed.inject(GreatThingsCacheService);
  });

  afterEach(() => auth.cleanupObservables());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when a user logs out', () => {
    it('empties the cache', () => {
      service.addGreatThings(<any>['test', 'test2']);
      auth.onAuthStateChanged.observer.next('unauthenticated');
      expect(service.greatThings).toEqual([]);
    });
  });

  describe('addGreatThings', () => {
    it('adds the passed in GreatThings to the cache', () => {
      expect(service.greatThings).toEqual([]);
      service.addGreatThings([buildGreatThing({ id: '1' }), buildGreatThing({ id: '2' })]);
      expect(service.greatThings).toEqual([buildGreatThing({ id: '1' }), buildGreatThing({ id: '2' })]);
    });

    it('updates any great things that already exist', () => {
      const newThing = buildGreatThing({ id: '1' });
      const updated = buildGreatThing({ id: '1' });
      service.addGreatThings([newThing]);
      service.addGreatThings([updated]);
      expect(service.greatThings).toEqual([updated]);
      expect(service.greatThings[0]).toBe(updated);
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
