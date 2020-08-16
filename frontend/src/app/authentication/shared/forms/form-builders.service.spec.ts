import { TestBed } from '@angular/core/testing';

import { FormBuildersService } from './form-builders.service';

describe('FormBuildersService', () => {
  let service: FormBuildersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormBuildersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
