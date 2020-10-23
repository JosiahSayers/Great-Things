import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeProfilePictureComponent } from '@src/app/account/change-profile-picture/change-profile-picture.component';
import { ErrorNotificationComponent } from '@src/app/shared/components/error-notification/error-notification.component';
import { FileUploadComponent } from '@src/app/shared/components/file-upload/file-upload.component';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { spyOnClass } from '@src/app/utils/testing/helper-functions';
import { Spied } from '@src/app/utils/testing/spied.interface';
import { MockComponent } from 'ng-mocks';
import { AccountService } from '@src/app/account/shared/services/account.service';

describe('ChangeProfilePictureComponent', () => {
  let component: ChangeProfilePictureComponent;
  let fixture: ComponentFixture<ChangeProfilePictureComponent>;
  let formBuilder: Spied<FormBuildersService>;
  let router: Spied<Router>;
  let accountService: Spied<AccountService>;
  const testFile = new File([], 'test');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        ChangeProfilePictureComponent,
        MockComponent(FileUploadComponent),
        MockComponent(ErrorNotificationComponent)
      ],
      providers: [
        {
          provide: FormBuildersService,
          useFactory: () => formBuilder = spyOnClass(FormBuildersService)
        },
        {
          provide: Router,
          useFactory: () => router = spyOnClass(Router)
        },
        {
          provide: AccountService,
          useFactory: () => accountService = spyOnClass(AccountService, [
            'changeProfilePicture'
          ])
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeProfilePictureComponent);
    component = fixture.componentInstance;
    stubForm();
    fixture.detectChanges();
  });

  afterEach(() => {
    accountService.cleanupObservables();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFormSubmit', () => {
    it('does nothing if the form is invalid', () => {
      spyOnProperty(component.form, 'valid').and.returnValue(false);
      component.onFormSubmit();
      expect(accountService.changeProfilePicture).not.toHaveBeenCalled();
    });

    describe('then the form is valid', () => {
      it('sets the component properties to the expected values', () => {
        component.isLoading = false;
        component.errorNotificationState = 'shown';
        spyOnProperty(component.form, 'valid').and.returnValue(true);
        component.onFormSubmit();
        expect(component.isLoading).toBeTrue();
        expect(component.errorNotificationState).toBe('hidden');
      });

      it('calls the update method with the expected arguments', () => {
        spyOnProperty(component.form, 'valid').and.returnValue(true);
        component.image.setValue(testFile);
        component.onFormSubmit();
        expect(accountService.changeProfilePicture).toHaveBeenCalledWith(testFile);
      });

      it('sets isLoading to false and navigates to account overview when the API call succeeds', () => {
        spyOnProperty(component.form, 'valid').and.returnValue(true);
        component.onFormSubmit();
        accountService.changeProfilePicture.observer.next(null);
        expect(component.isLoading).toBeFalse();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/account');
      });

      it('sets isLoading to false and errorNotificationState to shown when the API call fails', () => {
        spyOnProperty(component.form, 'valid').and.returnValue(true);
        component.onFormSubmit();
        accountService.changeProfilePicture.observer.error(null);
        expect(component.isLoading).toBeFalse();
        expect(component.errorNotificationState).toBe('shown');
      });
    });
  });

  describe('fileSelected', () => {
    it('marks the image control as touched', () => {
      expect(component.image.touched).toBeFalse();
      component.fileSelected(testFile);
      expect(component.image.touched).toBe(true);
    });

    it('sets the image control value to the passed in file', () => {
      component.fileSelected(testFile);
      expect(component.image.value).toBe(testFile);
    });
  });

  describe('image', () => {
    it('returns the image form control', () => {
      expect(component.image).toBe(component.form.controls.image);
    });
  });

  describe('disableSubmit', () => {
    it('returns true when the form is invalid', () => {
      spyOnProperty(component.form, 'invalid').and.returnValue(true);
      expect(component.disableSubmit).toBeTrue();
    });

    it('returns false when the form is valid', () => {
      spyOnProperty(component.form, 'invalid').and.returnValue(false);
      expect(component.disableSubmit).toBeFalse();
    });
  });

  function stubForm(): void {
    formBuilder.uploadImageForm.and.returnValue(new FormGroup({
      image: new FormControl()
    }));
  }
});
