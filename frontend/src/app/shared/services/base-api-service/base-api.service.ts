import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SidelogService } from 'sidelog-angular';

export class BaseApiService {

  constructor(
    protected http: HttpClient,
    protected logger: SidelogService
  ) { }

  protected get<T>(url: string, options: HttpOptions, logIdentifier: string): Observable<T> {
    const apiCall = () => this.http.get<T>(url, options);
    return this.sendWithLogs<T>(apiCall, { logIdentifier, options, url });
  }

  protected post<T>(url: string, payload: any, options: HttpOptions, logIdentifier: string): Observable<T> {
    const apiCall = () => this.http.post<T>(url, payload, options);
    return this.sendWithLogs<T>(apiCall, { logIdentifier, options, url, payload });
  }

  protected delete<T>(url: string, options: HttpOptions, logIdentifier: string): Observable<T> {
    const apiCall = () => this.http.delete<T>(url, options);
    return this.sendWithLogs<T>(apiCall, { logIdentifier, options, url });
  }

  private sendWithLogs<T>(
    apiCall: () => Observable<T>,
    callInfo: { logIdentifier: string, options: HttpOptions, url: string, payload?: any }): Observable<T> {

    this.logger.info({
      message: callInfo.logIdentifier + ' REQUEST',
      json: {
        params: this.httpItemToObject(callInfo.options.params),
        headers: this.httpItemToObject(callInfo.options.headers),
        payload: callInfo.payload,
        url: callInfo.url
      }
    });

    return apiCall().pipe(
      tap((res) => this.logger.info({
        message: callInfo.logIdentifier + ' RESPONSE',
        json: <any>res
      })),
      catchError((err) => {
        this.logger.error({
          message: callInfo.logIdentifier + ' RESPONSE ERROR',
          json: err
        });
        return throwError(err);
      })
    );
  }

  private httpItemToObject(item: HttpHeaders | HttpParams) {
    const output = {};

    item?.keys().forEach((key) => {
      output[key] = item.get(key);
    });

    return output;
  }
}

interface HttpOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
}
