import { TestBed } from '@angular/core/testing';
import { GreatThingsInterceptorService } from './great-things.interceptor';
import { Spied } from '../../utils/testing/spied.interface';
import { spyOnClass } from '../../utils/testing/helper-functions';
import { AuthService } from '../services/auth/auth.service';
import { HttpRequest, HttpHandler } from '@angular/common/http';

describe('GreatThingsInterceptorService', () => {
  let service: GreatThingsInterceptorService;
  let authService: Spied<AuthService>;
  let updatedRequest: HttpRequest<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GreatThingsInterceptorService,
        {
          provide: AuthService,
          useFactory: () => authService = spyOnClass(AuthService)
        }
      ]
    });
    service = TestBed.inject(GreatThingsInterceptorService);
  });

  afterEach(() => updatedRequest = null);

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('adds the jwt from the storage service if it is truthy', () => {
    authService.encodedJwt.and.returnValue('ENCODED_JWT');
    service.intercept(mockReq(), mockNext());
    expect(updatedRequest.headers.get('Authorization')).toBe('Bearer ENCODED_JWT');
  });

  it('does not add the jwt from the storage service if it is falsy', () => {
    authService.encodedJwt.and.returnValue('');
    service.intercept(mockReq(), mockNext());
    expect(updatedRequest.headers.get('Authorization')).toBeNull();
  });

  it('adds the transaction-id header using the current time', () => {
    service.intercept(mockReq(), mockNext());
    const transactionId = updatedRequest.headers.get('transaction-id');
    expect(transactionId).toBeLessThan(new Date().getTime() + 100);
    expect(transactionId).toBeGreaterThan(new Date().getTime() - 100);
  });

  function mockReq(): HttpRequest<any> {
    return new HttpRequest(
      'GET',
      ''
    );
  }

  function mockNext(): HttpHandler {
    return <any>{
      handle: (req: HttpRequest<any>) => updatedRequest = req
    };
  }
});
