import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class LoggerService {

  constructor(
    private http: HttpClient
  ) { }

  log(): void {

  }

  send(): void {

  }
}
