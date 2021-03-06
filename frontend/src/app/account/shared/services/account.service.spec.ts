import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ImageUploadService } from '@src/app/shared/services/image-upload/image-upload.service';
import { Observable, Subscription } from 'rxjs';
import { SidelogService } from 'sidelog-angular';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { spyOnClass } from '../../../utils/testing/helper-functions';
import { Spied } from '../../../utils/testing/spied.interface';
import { AccountService } from './account.service';
import { FileSaverService } from './file-saver.service';

describe('AccountService', () => {
  let service: AccountService;
  let sidelog: Spied<SidelogService>;
  let auth: Spied<AuthService>;
  let http: HttpTestingController;
  let fileSaver: Spied<FileSaverService>;
  let testSub: Subscription;
  let imageUpload: Spied<ImageUploadService>;

  const testUserId = 'USER_ID';
  const updateUrl = `${environment.BACKEND_BASE}/users/USER_ID`;
  const downloadAllDataUrl = `${environment.BACKEND_BASE}/users/USER_ID/all-data`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AccountService,
        {
          provide: SidelogService,
          useFactory: () => sidelog = spyOnClass(SidelogService)
        },
        {
          provide: AuthService,
          useFactory: () => auth = spyOnClass(AuthService)
        },
        {
          provide: FileSaverService,
          useFactory: () => fileSaver = spyOnClass(FileSaverService)
        },
        {
          provide: ImageUploadService,
          useFactory: () => imageUpload = spyOnClass(ImageUploadService, [
            'upload'
          ])
        }
      ]
    });
    service = TestBed.inject(AccountService);
    http = TestBed.inject(HttpTestingController);
    auth.userId.and.returnValue(testUserId);
  });

  afterEach(() => {
    testSub?.unsubscribe();
    http.verify();
    imageUpload.cleanupObservables();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('update', () => {
    it('sends a PATCH request to the correct URL', () => {
      testSub = service.update({}).subscribe();
      const request = http.expectOne(updateUrl).request;
      expect(request.method).toBe('PATCH');
    });

    it('passes the params argument as the payload', () => {
      testSub = service.update({ name: 'New Name' }).subscribe();
      const request = http.expectOne(updateUrl).request;
      expect(request.body).toEqual({ name: 'New Name' });
    });

    it('taps the response to pass the updated jwt to the auth service', (done) => {
      testSub = service.update({}).subscribe(() => {
        expect(auth.updateJwt).toHaveBeenCalledWith('NEW JWT');
        done();
      });
      http.expectOne(updateUrl).flush({ jwt: 'NEW JWT' });
    });

    it('maps the response to null', (done) => {
      testSub = service.update({}).subscribe((res) => {
        expect(res).toBeNull();
        done();
      });
      http.expectOne(updateUrl).flush({ jwt: 'NEW JWT' });
    });
  });

  describe('downloadAllData', () => {
    it('sends a GET request to the correct URL', () => {
      testSub = service.downloadAllData().subscribe();
      const request = http.expectOne(downloadAllDataUrl).request;
      expect(request.method).toBe('GET');
    });
  });

  describe('changeProfilePicture', () => {
    const testImage = new File([], 'test');

    it('sends a request to the image upload service', () => {
      testSub = service.changeProfilePicture(testImage).subscribe();
      expect(imageUpload.upload).toHaveBeenCalledWith(testImage);
    });

    it('sends the new picture ID to the update method after the upload completes', () => {
      const updateSpy = spyOn(service, 'update').and.returnValue(new Observable());
      testSub = service.changeProfilePicture(testImage).subscribe();
      expect(updateSpy).not.toHaveBeenCalled();
      imageUpload.upload.observer.next({ id: 'NEW PICTURE ID' });
      expect(updateSpy).toHaveBeenCalledWith({ pictureId: 'NEW PICTURE ID' });
    });
  });
});
