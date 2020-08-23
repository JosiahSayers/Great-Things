import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GreatThingsResponse } from '../../models/api-responses/great-thing.interface';
import { GreatThing } from '../../models/GreatThing.model';
import { Picture } from '../../models/Picture.model';

@Injectable()
export class GreatThingsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get(): Observable<GreatThing[]> {
    return this.http.get<GreatThingsResponse>(environment.BACKEND.greatThings.base(this.authService.userId())).pipe(
      map((res) => {
        let greatThings = [];

        if (Array.isArray(res?.greatThings)) {
          greatThings = res.greatThings.map((item) => {
            const picture = item.picture ? new Picture(
              item.picture.id,
              item.picture.createdAt,
              item.picture.href,
              item.picture.height,
              item.picture.width,
              item.picture.format
            ) : null;

            return new GreatThing(
              item.id,
              item.text,
              item.createdAt,
              item.lastUpdatedAt,
              picture
            );
          });
        }

        return greatThings;
      })
    );
  }
}
