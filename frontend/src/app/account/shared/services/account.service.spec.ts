import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SidelogService } from 'sidelog-angular';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { spyOnClass } from '../../../utils/testing/helper-functions';
import { Spied } from '../../../utils/testing/spied.interface';

import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;
  let sidelog: Spied<SidelogService>;
  let auth: Spied<AuthService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AccountService,
        {
          provide: SidelogService,
          useFactory: () => sidelog = spyOnClass(SidelogService)
        },
        {
          provide: AuthService,
          useFactory: () => auth = spyOnClass(AuthService)
        }
      ]
    });
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
