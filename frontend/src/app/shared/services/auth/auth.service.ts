import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/v1/auth/authenticate', {
      username,
      password
    },
      {
        headers: {
          'transaction-id': `${new Date().getTime()}`
        }
      });
  }
}
