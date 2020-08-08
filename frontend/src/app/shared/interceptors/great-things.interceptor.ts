import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { StorageService } from '../services/storage/storage.service';
import { Observable } from 'rxjs';
import { storageKeys } from '../services/storage/storage-keys';

@Injectable()
export class GreatThingsInterceptorService implements HttpInterceptor {

  constructor(
    private storage: StorageService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = this.storage.get(storageKeys.JWT);
    let newHeaders = req.headers;

    if (jwt) {
      newHeaders = newHeaders.append('Authorization', `Bearer ${jwt}`);
    }
    newHeaders = newHeaders.append('transaction-id', `${new Date().getTime()}`);

    const updatedReq = req.clone({ headers: newHeaders });
    return next.handle(updatedReq);
  }
}
