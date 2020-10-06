import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GreatThingsResponse } from '../../models/api-responses/great-thing.interface';
import { GreatThing } from '../../models/GreatThing.model';
import { Picture } from '../../models/Picture.model';
import { BaseApiService } from '../base-api-service/base-api-service.service';
import { API_LOG_IDENTIFIERS } from '../../constants/api-log-identifiers';
import { GetRequestParams } from './get-request-params.interface';
import { SidelogService } from 'sidelog-angular';

@Injectable()
export class GreatThingsService extends BaseApiService {

  constructor(
    protected http: HttpClient,
    private authService: AuthService,
    protected logger: SidelogService
  ) {
    super(http, logger);
  }

  retrieve(searchParams?: GetRequestParams): Observable<GreatThing[]> {
    const url = `${environment.BACKEND_BASE}/users/${this.authService.userId()}/great-things`;
    const params = new HttpParams({
      fromObject: <any>searchParams
    });
    return this.get<GreatThingsResponse>(url, { params }, API_LOG_IDENTIFIERS.GREAT_THINGS.GET).pipe(
      map(this.mapResponse)
    );
  }

  create(text: string, pictureId?: string): Observable<void> {
    const url = `${environment.BACKEND_BASE}/users/${this.authService.userId()}/great-things`;
    const payload = { text, pictureId };
    return this.post<void>(url, payload, {}, API_LOG_IDENTIFIERS.GREAT_THINGS.POST);
  }

  remove(greatThingId: string): Observable<void> {
    const url = `${environment.BACKEND_BASE}/users/${this.authService.userId()}/great-things/${greatThingId}`;
    return this.delete<void>(url, {}, API_LOG_IDENTIFIERS.GREAT_THINGS.DELETE);
  }

  private mapResponse(res: GreatThingsResponse): GreatThing[] {
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
          item.updatedAt,
          picture
        );
      });
    }

    return greatThings;
  }
}
