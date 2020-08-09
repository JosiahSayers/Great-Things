import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../storage/storage.service';
import { storageKeys } from '../storage/storage-keys';
import { AuthCallResponse } from '../../../models/api-responses/login.interface';
import { JWT } from '../../../models/jwt.interface';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private jwtHelper: JwtHelperService
  ) { }

  login(username: string, password: string): Observable<void> {
    return this.http.post<AuthCallResponse>(environment.BACKEND.login, {
      username,
      password
    }).pipe(
      tap((res: AuthCallResponse) => this.storage.set(storageKeys.JWT, res.jwt)),
      map(() => undefined)
    );
  }

  refreshJwt(): Observable<void> {
    return this.http.get<AuthCallResponse>(environment.BACKEND.refreshToken)
      .pipe(
        tap((res: AuthCallResponse) => this.storage.set(storageKeys.JWT, res.jwt)),
        map(() => undefined)
      );
  }

  isLoggedIn(): boolean {
    const jwtString = this.storage.get(storageKeys.JWT);
    return !!jwtString && !this.jwtHelper.isTokenExpired(jwtString);
  }

  tokenExpiration(): Date {
    return this.jwtHelper.getTokenExpirationDate(this.storage.get(storageKeys.JWT));
  }

  get jwt(): JWT {
    return this.jwtHelper.decodeToken(this.storage.get(storageKeys.JWT));
  }
}
