import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GreatThingFromApi, GreatThingsResponse } from '../../models/api-responses/great-thing.interface';
import { GreatThing } from '../../models/GreatThing.model';
import { Picture } from '../../models/Picture.model';
import { BaseApiService } from '../base-api-service/base-api.service';
import { API_LOG_IDENTIFIERS } from '../../constants/api-log-identifiers';
import { GetRequestParams } from './get-request-params.interface';
import { SidelogService } from 'sidelog-angular';
import { GreatThingsCacheService } from '@src/app/great-things/shared/services/great-things-cache/great-things-cache.service';

@Injectable()
export class GreatThingsService extends BaseApiService {

  constructor(
    protected http: HttpClient,
    private authService: AuthService,
    protected logger: SidelogService,
    private cache: GreatThingsCacheService
  ) {
    super(http, logger);
  }

  retrieve(searchParams?: GetRequestParams): Observable<GreatThing[]> {
    const url = `${environment.BACKEND_BASE}/users/${this.authService.userId()}/great-things`;
    const params = new HttpParams({
      fromObject: <any>searchParams
    });
    return this.get<GreatThingsResponse>(url, { params }, API_LOG_IDENTIFIERS.GREAT_THINGS.GET).pipe(
      map((res) => {
        if (Array.isArray(res?.greatThings)) {
          return res.greatThings.map(this.mapResponseToGreatThing);
        }
      })
    );
  }

  create(text: string, pictureId?: string): Observable<GreatThing> {
    const url = `${environment.BACKEND_BASE}/users/${this.authService.userId()}/great-things`;
    const payload = { text, pictureId };
    return this.post<GreatThingFromApi>(url, payload, {}, API_LOG_IDENTIFIERS.GREAT_THINGS.POST).pipe(
      map(this.mapResponseToGreatThing),
      tap((greatThing) => this.cache.addGreatThings([greatThing]))
    );
  }

  remove(greatThingId: string): Observable<void> {
    const url = `${environment.BACKEND_BASE}/users/${this.authService.userId()}/great-things/${greatThingId}`;
    return this.delete<void>(url, {}, API_LOG_IDENTIFIERS.GREAT_THINGS.DELETE);
  }

  edit({ id, text, pictureId }: EditGreatThingRequest): Observable<GreatThing> {
    const url = `${environment.BACKEND_BASE}/users/${this.authService.userId()}/great-things/${id}`;
    const payload = { text, pictureId };
    return this.put<GreatThing>(url, payload, {}, API_LOG_IDENTIFIERS.GREAT_THINGS.PUT);
  }

  private mapResponseToGreatThing(gt: GreatThingFromApi): GreatThing {
    const picture = gt.picture ? new Picture(
      gt.picture.id,
      gt.picture.createdAt,
      gt.picture.href,
      gt.picture.height,
      gt.picture.width,
      gt.picture.format
    ) : null;

    return new GreatThing(
      gt.id,
      gt.text,
      gt.createdAt,
      gt.updatedAt,
      picture
    );
  }
}

interface EditGreatThingRequest {
  id: string;
  text?: string;
  pictureId?: string;
}
