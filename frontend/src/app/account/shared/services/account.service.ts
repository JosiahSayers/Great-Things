import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
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
    private auth: AuthService,
    @Inject('window') private window
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

  downloadAllData(): Observable<void> {
    const url = `${environment.BACKEND_BASE}/users/${this.auth.userId()}/all-data`;
    const logIdentifier = API_LOG_IDENTIFIERS.USERS.DOWNLOAD_ALL_DATA;
    return this.get<HttpResponse<Blob>>(url, { responseType: 'blob', observe: 'response' }, logIdentifier).pipe(
      tap((res: HttpResponse<Blob>) => {
        const blob = new Blob([res.body], { type: res.headers.get('Content-Type') });
        const filename = res.headers.get('Content-Disposition').split('filename=')[1];

        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }),
      map(() => null)
    );
  }
}

interface AccountUpdateParams {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  name?: string;
  pictureId?: string;
}

interface UserUpdateResponse {
  jwt: string;
}
