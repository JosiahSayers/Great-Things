import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { environment } from '@src/environments/environment';

@Injectable()
export class GreatThingsInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(environment.BACKEND_BASE)) {

      const jwt = this.authService.encodedJwt();
      let newHeaders = req.headers;

      if (jwt) {
        newHeaders = newHeaders.append('Authorization', `Bearer ${jwt}`);
      }
      newHeaders = newHeaders.append('transaction-id', `${new Date().getTime()}`);

      const updatedReq = req.clone({ headers: newHeaders });
      return next.handle(updatedReq);
    } else {
      return next.handle(req);
    }
  }
}
