import { TestBed } from '@angular/core/testing';

import { GreatThingsService } from './great-things.service';

describe('GreatThingsService', () => {
  let service: GreatThingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreatThingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
