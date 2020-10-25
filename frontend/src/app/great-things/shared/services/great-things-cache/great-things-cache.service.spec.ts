import { TestBed } from '@angular/core/testing';

import { GreatThingsCacheService } from './great-things-cache.service';

describe('GreatThingsCacheService', () => {
  let service: GreatThingsCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreatThingsCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
