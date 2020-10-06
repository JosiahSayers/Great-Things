import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Spied } from '../../../utils/testing/spied.interface';
import { StorageService } from '../storage/storage.service';
import { spyOnClass } from '../../../utils/testing/helper-functions';
import { WebStorageService } from '../storage/web-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { JWT } from '../../models/jwt.interface';
import { storageKeys } from '../storage/storage-keys';

describe('AuthService', () => {
  let service: AuthService;
  let storage: Spied<StorageService>;
  let jwtHelper: Spied<JwtHelperService>;
  let http: HttpTestingController;
  let testSub: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        {
          provide: StorageService,
          useFactory: () => storage = spyOnClass(WebStorageService)
        },
        {
          provide: JwtHelperService,
          useFactory: () => jwtHelper = spyOnClass(JwtHelperService)
        }
      ]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    if (testSub && testSub.unsubscribe) {
      testSub.unsubscribe();
    }

    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('makes an http post request to the configured endpoint', () => {
      testSub = service.register('', '', '').subscribe();
      const req = http.expectOne(`${environment.BACKEND_BASE}/auth/register`);
      expect(req.request.method).toBe('POST');
    });

    it('passes the email, password, and name into the body of the request', () => {
      testSub = service.register('EMAIL', 'PASSWORD', 'FIRST LAST').subscribe();
      const req = http.expectOne(`${environment.BACKEND_BASE}/auth/register`);
      expect(req.request.body).toEqual({
        username: 'EMAIL',
        password: 'PASSWORD',
        name: 'FIRST LAST'
      });
    });

    it('taps the response and saves it to the storage service', (done) => {
      testSub = service.register('', '', '').subscribe(() => {
        expect(storage.set).toHaveBeenCalledWith(storageKeys.JWT, 'ENCODED_JWT');
        done();
      });
      http.expectOne(`${environment.BACKEND_BASE}/auth/register`).flush({ jwt: 'ENCODED_JWT' });
    });

    it('maps the response to undefined', (done) => {
      testSub = service.register('', '', '').subscribe((res) => {
        expect(res).toBeUndefined();
        done();
      });
      http.expectOne(`${environment.BACKEND_BASE}/auth/register`).flush({ jwt: 'ENCODED_JWT' });
    });
  });

  describe('login', () => {
    it('makes an http post request to the configured endpoint', () => {
      testSub = service.login('', '').subscribe();
      const req = http.expectOne(`${environment.BACKEND_BASE}/auth/authenticate`);
      expect(req.request.method).toBe('POST');
    });

    it('passes the email and password into the body of the request', () => {
      testSub = service.login('EMAIL', 'PASSWORD').subscribe();
      const req = http.expectOne(`${environment.BACKEND_BASE}/auth/authenticate`);
      expect(req.request.body).toEqual({
        username: 'EMAIL',
        password: 'PASSWORD'
      });
    });

    it('taps the response and saves it to the storage service', (done) => {
      testSub = service.login('', '').subscribe(() => {
        expect(storage.set).toHaveBeenCalledWith(storageKeys.JWT, 'ENCODED_JWT');
        done();
      });
      http.expectOne(`${environment.BACKEND_BASE}/auth/authenticate`).flush({ jwt: 'ENCODED_JWT' });
    });

    it('maps the response to undefined', (done) => {
      testSub = service.login('', '').subscribe((res) => {
        expect(res).toBeUndefined();
        done();
      });
      http.expectOne(`${environment.BACKEND_BASE}/auth/authenticate`).flush({ jwt: 'ENCODED_JWT' });
    });
  });

  describe('logout', () => {
    it('calls the remove function of the storage service with the correct key', () => {
      service.logout();
      expect(storage.remove).toHaveBeenCalledWith(storageKeys.JWT);
    });
  });

  describe('refreshJwt', () => {
    it('makes an http get request to the configured endpoint', () => {
      testSub = service.refreshJwt().subscribe();
      const req = http.expectOne(`${environment.BACKEND_BASE}/auth/refresh`);
      expect(req.request.method).toBe('GET');
    });

    it('taps the response and saves it to the storage service', (done) => {
      testSub = service.refreshJwt().subscribe(() => {
        expect(storage.set).toHaveBeenCalledWith(storageKeys.JWT, 'ENCODED_JWT');
        done();
      });
      http.expectOne(`${environment.BACKEND_BASE}/auth/refresh`).flush({ jwt: 'ENCODED_JWT' });
    });

    it('maps the response to undefined', (done) => {
      testSub = service.refreshJwt().subscribe((res) => {
        expect(res).toBeUndefined();
        done();
      });
      http.expectOne(`${environment.BACKEND_BASE}/auth/refresh`).flush({ jwt: 'ENCODED_JWT' });
    });
  });

  describe('isLoggedIn', () => {
    it('grabs the jwt string from the storage service', () => {
      storage.get.and.returnValue('ENCODED_JWT');
      service.isLoggedIn();
      expect(storage.get).toHaveBeenCalledWith(storageKeys.JWT);
    });

    it('returns false if the jwtString is falsy', () => {
      storage.get.and.returnValue(null);
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('passes the jwt string to jwtHelper.isTokenExpired', () => {
      storage.get.and.returnValue('ENCODED_JWT');
      service.isLoggedIn();
      expect(jwtHelper.isTokenExpired).toHaveBeenCalledWith('ENCODED_JWT');
    });

    it('returns false if jwtHelper.isTokenExpired returns true', () => {
      storage.get.and.returnValue('ENCODED_JWT');
      jwtHelper.isTokenExpired.and.returnValue(true);
      expect(service.isLoggedIn()).toBe(false);
    });

    it('returns true if jwtString is defined and jwtHelper.isTokenExpired returns true', () => {
      storage.get.and.returnValue('ENCODED_JWT');
      jwtHelper.isTokenExpired.and.returnValue(false);
      expect(service.isLoggedIn()).toBe(true);
    });
  });

  describe('tokenExpiration', () => {
    it('passes the jwt from storage to jwtHelper.getTokenExpirationDate and returns the result', () => {
      const currentDate = new Date();
      storage.get.and.returnValue('ENCODED_JWT');
      jwtHelper.getTokenExpirationDate.and.returnValue(currentDate);
      expect(service.tokenExpiration()).toBe(currentDate);
      expect(storage.get).toHaveBeenCalledWith(storageKeys.JWT);
      expect(jwtHelper.getTokenExpirationDate).toHaveBeenCalledWith('ENCODED_JWT');
    });
  });

  describe('jwt', () => {
    it('passes the jwt from storage to jwtHelper.decodeToken and returns the result', () => {
      storage.get.and.returnValue('ENCODED_JWT');
      jwtHelper.decodeToken.and.returnValue(createJwt({}));
      expect(service.jwt()).toEqual(createJwt({}));
      expect(storage.get).toHaveBeenCalledWith(storageKeys.JWT);
      expect(jwtHelper.decodeToken).toHaveBeenCalledWith('ENCODED_JWT');
    });
  });

  describe('encodedJwt', () => {
    it('returns the jwt from storage', () => {
      storage.get.and.returnValue('ENCODED_JWT');
      expect(service.encodedJwt()).toBe('ENCODED_JWT');
    });
  });
});

function createJwt(params: Partial<JWT>): JWT {
  return {
    email: params.email || '',
    id: params.id || '',
    name: params.name || '',
    iat: params.iat || 12345,
    exp: params.exp || 7890
  };
}
