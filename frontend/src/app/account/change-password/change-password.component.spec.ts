import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '@src/app/account/change-password/change-password.component';
import { MockComponent } from 'ng-mocks';
import { ErrorNotificationComponent } from '../../shared/components/error-notification/error-notification.component';
import { PasswordCheckComponent } from '../../shared/components/password-check/password-check.component';
import { FormBuildersService } from '../../shared/services/forms/form-builders.service';
import { spyOnClass } from '../../utils/testing/helper-functions';
import { Spied } from '../../utils/testing/spied.interface';
import { AccountService } from '../shared/services/account.service';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let formBuilder: Spied<FormBuildersService>;
  let router: Spied<Router>;
  let accountService: Spied<AccountService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        ChangePasswordComponent,
        MockComponent(PasswordCheckComponent),
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
            'update'
          ])
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    stubForm();
    fixture.detectChanges();
  });

  afterEach(() => accountService.cleanupObservables());

  describe('onFormSubmit', () => {
    it('does nothing if the form is invalid', () => {
      spyOnProperty(component.form, 'valid').and.returnValue(false);
      component.onFormSubmit();
      expect(accountService.update).not.toHaveBeenCalled();
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
        component.currentPassword.setValue('CURRENT');
        component.newPassword.setValue('NEW');
        component.onFormSubmit();
        expect(accountService.update).toHaveBeenCalledWith({ currentPassword: 'CURRENT', newPassword: 'NEW' });
      });

      it('sets isLoading to false and navigates to account overview when the API call succeeds', () => {
        spyOnProperty(component.form, 'valid').and.returnValue(true);
        component.onFormSubmit();
        accountService.update.observer.next(null);
        expect(component.isLoading).toBeFalse();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/account');
      });

      it('sets isLoading to false and errorNotificationState to shown when the API call fails', () => {
        spyOnProperty(component.form, 'valid').and.returnValue(true);
        component.onFormSubmit();
        accountService.update.observer.error(null);
        expect(component.isLoading).toBeFalse();
        expect(component.errorNotificationState).toBe('shown');
      });
    });
  });

  describe('isCurrentPasswordInvalid', () => {
    it('returns true if the password control is touched and not valid', () => {
      component.form.controls.currentPassword.markAsTouched();
      spyOnProperty(component.form.controls.currentPassword, 'invalid').and.returnValue(true);
      expect(component.isCurrentPasswordInvalid).toBeTrue();
    });

    it('returns false if the password control is not touched', () => {
      expect(component.isCurrentPasswordInvalid).toBeFalse();
    });

    it('returns false if the password control is touched and valid', () => {
      component.form.controls.currentPassword.markAsTouched();
      spyOnProperty(component.form.controls.currentPassword, 'invalid').and.returnValue(false);
      expect(component.isCurrentPasswordInvalid).toBeFalse();
    });
  });

  describe('isNewPasswordInvalid', () => {
    it('returns true if the password control is touched and not valid', () => {
      component.form.controls.newPassword.markAsTouched();
      spyOnProperty(component.form.controls.newPassword, 'invalid').and.returnValue(true);
      expect(component.isNewPasswordInvalid).toBeTrue();
    });

    it('returns false if the password control is not touched', () => {
      expect(component.isNewPasswordInvalid).toBeFalse();
    });

    it('returns false if the password control is touched and valid', () => {
      component.form.controls.newPassword.markAsTouched();
      spyOnProperty(component.form.controls.newPassword, 'invalid').and.returnValue(false);
      expect(component.isNewPasswordInvalid).toBeFalse();
    });
  });

  describe('isNewPasswordValid', () => {
    it('returns true if the password control is touched and valid', () => {
      component.form.controls.newPassword.markAsTouched();
      spyOnProperty(component.form.controls.newPassword, 'valid').and.returnValue(true);
      expect(component.isNewPasswordValid).toBeTrue();
    });

    it('returns false if the password control is not touched', () => {
      expect(component.isNewPasswordValid).toBeFalse();
    });

    it('returns false if the password control is touched but not valid', () => {
      component.form.controls.newPassword.markAsTouched();
      spyOnProperty(component.form.controls.newPassword, 'valid').and.returnValue(false);
      expect(component.isNewPasswordValid).toBeFalse();
    });
  });

  describe('passwordErrors', () => {
    it('converts the errors object on the password control into a PasswordErrors interface', () => {
      component.form.controls.newPassword.setErrors({
        minlength: true,
        lowerCase: true
      });
      expect(component.passwordErrors).toEqual({
        required: false,
        minlength: true,
        lowerCase: true,
        upperCase: false,
        numbers: false
      });
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function stubForm(): void {
    formBuilder.changePasswordForm.and.returnValue(new FormGroup({
      currentPassword: new FormControl(),
      newPassword: new FormControl()
    }));
  }
});
