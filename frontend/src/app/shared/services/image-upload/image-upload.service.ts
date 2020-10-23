import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { SidelogService } from 'sidelog-angular';
import { API_LOG_IDENTIFIERS } from '@src/app/shared/constants/api-log-identifiers';
import { AuthService } from '@src/app/shared/services/auth/auth.service';
import { BaseApiService } from '@src/app/shared/services/base-api-service/base-api.service';

@Injectable()
export class ImageUploadService extends BaseApiService {

  constructor(
    protected http: HttpClient,
    protected logger: SidelogService,
    private auth: AuthService
  ) {
    super(http, logger);
  }

  upload(file: File): Observable<UploadResponse> {
    const url = `${environment.BACKEND_BASE}/users/${this.auth.userId()}/great-things/upload-image`;
    const formData = new FormData();
    formData.append('image', file);
    const loggerIdentifier = API_LOG_IDENTIFIERS.IMAGES.UPLOAD;
    return this.post<UploadResponse>(url, formData, {}, loggerIdentifier);
  }
}

interface UploadResponse {
  createdAt: string;
  id: string;
  ownerId: string;
  format: string;
  height: number;
  width: number;
  href: string;
}
