import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SidelogService } from 'sidelog-angular';
import { spyOnClass } from '../../../utils/testing/helper-functions';
import { Spied } from '../../../utils/testing/spied.interface';
import { BaseApiService } from './base-api.service';

@Injectable()
class TestClass extends BaseApiService {
  constructor(
    protected http: HttpClient,
    protected logger: SidelogService
  ) {
    super(http, logger);
  }
}

describe('BaseApiServiceService', () => {
  let service: TestClass;
  let http: Spied<HttpClient>;
  let logger: Spied<SidelogService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestClass,
        {
          provide: HttpClient,
          useFactory: () => http = spyOnClass(HttpClient)
        },
        {
          provide: SidelogService,
          useFactory: () => logger = spyOnClass(SidelogService)
        }
      ]
    });
    service = TestBed.inject(TestClass);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
