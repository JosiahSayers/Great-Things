import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../storage/storage.service';
import { storageKeys } from '../storage/storage-keys';
import { AuthCallResponse } from '../../models/api-responses/login.interface';
import { JWT } from '../../models/jwt.interface';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthService {

  private authStateChange$ = new Subject<AuthState>();

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private jwtHelper: JwtHelperService
  ) { }

  onAuthStateChanged(): Observable<AuthState> {
    return this.authStateChange$.asObservable();
  }

  register(username: string, password: string, name: string): Observable<void> {
    return this.http.post<AuthCallResponse>(`${environment.BACKEND_BASE}/auth/register`, {
      username,
      password,
      name
    }).pipe(
      tap((res: AuthCallResponse) => {
        this.storage.set(storageKeys.JWT, res.jwt);
        this.authStateChange$.next('authenticated');
      }),
      map(() => undefined)
    );
  }

  login(username: string, password: string): Observable<void> {
    return this.http.post<AuthCallResponse>(`${environment.BACKEND_BASE}/auth/authenticate`, {
      username,
      password
    }).pipe(
      tap((res: AuthCallResponse) => {
        this.storage.set(storageKeys.JWT, res.jwt);
        this.authStateChange$.next('authenticated');
      }),
      map(() => undefined)
    );
  }

  logout(): void {
    this.storage.remove(storageKeys.JWT);
    this.authStateChange$.next('unauthenticated');
  }

  refreshJwt(): Observable<void> {
    return this.http.get<AuthCallResponse>(`${environment.BACKEND_BASE}/auth/refresh`)
      .pipe(
        tap((res: AuthCallResponse) => this.storage.set(storageKeys.JWT, res.jwt)),
        map(() => undefined)
      );
  }

  updateJwt(newJwt: string): void {
    this.storage.set(storageKeys.JWT, newJwt);
  }

  isLoggedIn(): boolean {
    const jwtString = this.encodedJwt();
    return !!jwtString && !this.jwtHelper.isTokenExpired(jwtString);
  }

  tokenExpiration(): Date {
    return this.jwtHelper.getTokenExpirationDate(this.encodedJwt());
  }

  jwt(): JWT {
    return this.jwtHelper.decodeToken(this.encodedJwt());
  }

  encodedJwt(): string {
    return this.storage.get(storageKeys.JWT);
  }

  userId(): string {
    return this.jwt()?.id;
  }

  fullName(): string {
    return this.jwt()?.name;
  }

  firstName(): string {
    return this.jwt()?.name?.split(' ')[0];
  }

  photoHref(): string {
    return this.jwt()?.picture;
  }

  emailAddress(): string {
    return this.jwt()?.email;
  }
}

export type AuthState = 'authenticated' | 'unauthenticated';
