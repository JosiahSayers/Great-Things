import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { spyOnClass } from '../../utils/testing/helper-functions';
import { Spied } from '../../utils/testing/spied.interface';
import { GreatThingsGuard } from './great-things.guard';

describe('GreatThingsGuard', () => {
  let guard: GreatThingsGuard;
  let authService: Spied<AuthService>;
  let router: Spied<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GreatThingsGuard,
        {
          provide: AuthService,
          useFactory: () => authService = spyOnClass(AuthService)
        },
        {
          provide: Router,
          useFactory: () => router = spyOnClass(Router)
        }
      ]
    });
    guard = TestBed.inject(GreatThingsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('returns true when isLoggedIn is true', () => {
      authService.isLoggedIn.and.returnValue(true);
      expect(guard.canActivate()).toBeTrue();
    });

    it('returns a URL tree pointing to / when isLoggedIn is false', () => {
      authService.isLoggedIn.and.returnValue(false);
      router.parseUrl.and.returnValue('URL TREE');
      expect(guard.canActivate()).toBe(<any>'URL TREE');
      expect(router.parseUrl).toHaveBeenCalledWith('/');
    });
  });
});
