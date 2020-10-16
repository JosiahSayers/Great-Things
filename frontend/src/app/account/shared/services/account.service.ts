import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SidelogService } from 'sidelog-angular';
import { environment } from '@src/environments/environment';
import { API_LOG_IDENTIFIERS } from '@src/app/shared/constants/api-log-identifiers';
import { AuthService } from '@src/app/shared/services/auth/auth.service';
import { BaseApiService } from '@src/app/shared/services/base-api-service/base-api.service';

@Injectable()
export class AccountService extends BaseApiService {

  constructor(
    protected http: HttpClient,
    protected sidelog: SidelogService,
    private auth: AuthService
  ) {
    super(http, sidelog);
  }

  update(params: AccountUpdateParams): Observable<void> {
    const url = `${environment.BACKEND_BASE}/users/${this.auth.userId()}`;
    const logIdentifier = API_LOG_IDENTIFIERS.USERS.PATCH;
    return this.patch<UserUpdateResponse>(url, params, {}, logIdentifier).pipe(
      tap((res) => this.auth.updateJwt(res.jwt)),
      map(() => null)
    );
  }
}

interface AccountUpdateParams {
  email?: string;
  password?: string;
  name?: string;
  pictureId?: string;
}

interface UserUpdateResponse {
  jwt: string;
}
