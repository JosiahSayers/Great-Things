import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadPersonalDataComponent } from '@src/app/account/download-personal-data/download-personal-data.component';
import { ErrorNotificationComponent } from '@src/app/shared/components/error-notification/error-notification.component';
import { spyOnClass } from '@src/app/utils/testing/helper-functions';
import { Spied } from '@src/app/utils/testing/spied.interface';
import { MockComponent } from 'ng-mocks';
import { AccountService } from '../shared/services/account.service';

describe('DownloadPersonalDataComponent', () => {
  let component: DownloadPersonalDataComponent;
  let fixture: ComponentFixture<DownloadPersonalDataComponent>;
  let accountService: Spied<AccountService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadPersonalDataComponent,
        MockComponent(ErrorNotificationComponent)
      ],
      providers: [
        {
          provide: AccountService,
          useFactory: () => accountService = spyOnClass(AccountService, [
            'downloadAllData'
          ])
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => accountService.cleanupObservables());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFormSubmit', () => {
    it('sets the component properties to the expected values', () => {
      component.isLoading = false;
      component.errorNotificationState = 'shown';
      component.startDownload();
      expect(component.isLoading).toBeTrue();
      expect(component.errorNotificationState).toBe('hidden');
    });

    it('calls the downloadAllData method with the expected arguments', () => {
      component.startDownload();
      expect(accountService.downloadAllData).toHaveBeenCalledWith();
    });

    it('sets isLoading to false', () => {
      component.startDownload();
      accountService.downloadAllData.observer.next(null);
      expect(component.isLoading).toBeFalse();
    });

    it('sets isLoading to false and errorNotificationState to shown when the API call fails', () => {
      component.startDownload();
      accountService.downloadAllData.observer.error(null);
      expect(component.isLoading).toBeFalse();
      expect(component.errorNotificationState).toBe('shown');
    });
  });
});
