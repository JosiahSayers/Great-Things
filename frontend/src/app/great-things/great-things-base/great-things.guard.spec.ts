import { TestBed } from '@angular/core/testing';

import { GreatThingsGuard } from './great-things.guard';

describe('GreatThingsGuard', () => {
  let guard: GreatThingsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GreatThingsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
