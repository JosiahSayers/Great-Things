import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { spyOnClass } from '@src/app/utils/testing/helper-functions';
import { Spied } from '@src/app/utils/testing/spied.interface';
import { environment } from '@src/environments/environment';
import { Subscription } from 'rxjs';
import { SidelogService } from 'sidelog-angular';
import { AuthService } from '../auth/auth.service';
import { ImageUploadService } from './image-upload.service';

describe('ImageUploadService', () => {
  let service: ImageUploadService;
  let logger: Spied<SidelogService>;
  let auth: Spied<AuthService>;
  let http: HttpTestingController;

  let testSub: Subscription;
  const uploadUrl = `${environment.BACKEND_BASE}/users/USER_ID/great-things/upload-image`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ImageUploadService,
        {
          provide: SidelogService,
          useFactory: () => logger = spyOnClass(SidelogService)
        },
        {
          provide: AuthService,
          useFactory: () => auth = spyOnClass(AuthService)
        }
      ]
    });
    service = TestBed.inject(ImageUploadService);
    http = TestBed.inject(HttpTestingController);
    auth.userId.and.returnValue('USER_ID');
  });

  afterEach(() => {
    testSub?.unsubscribe();
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('upload', () => {
    it('sends a post request to the correct URL', () => {
      testSub = service.upload(null).subscribe();
      const request = http.expectOne(uploadUrl).request;
      expect(request.method).toBe('POST');
    });

    it('creates FormData from the passed in file and sends that to the API', () => {
      const testFile = new File([], 'test');
      testSub = service.upload(testFile).subscribe();
      const request = http.expectOne(uploadUrl).request;
      expect(request.body.get('image')).toBe(testFile);
      expect(request.body.getAll.length).toBe(1);
    });
  });
});
