import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from '@src/app/authentication/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuildersService } from '../../shared/services/forms/form-builders.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Spied } from '../../utils/testing/spied.interface';
import { spyOnClass } from '../../utils/testing/helper-functions';
import { PasswordCheckComponent } from '../shared/components/password-check/password-check.component';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ErrorNotificationComponent } from '@src/app/shared/components/error-notification/error-notification.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let formBuilder: FormBuildersService;
  let authService: Spied<AuthService>;
  let router: Spied<Router>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent,
        MockComponent(PasswordCheckComponent),
        MockComponent(ErrorNotificationComponent)
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        FormBuildersService,
        {
          provide: AuthService,
          useFactory: () => authService = spyOnClass(AuthService, ['register'])
        },
        {
          provide: Router,
          useFactory: () => router = spyOnClass(Router)
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuildersService);
    spyOn(formBuilder, 'registerForm').and.callThrough();
    fixture.detectChanges();
  });

  afterEach(() => authService.cleanupObservables());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls registerForm on the form builder', () => {
    expect(formBuilder.registerForm).toHaveBeenCalledTimes(1);
  });

  describe('isNameValid', () => {
    it('returns true if the name control is touched and valid', () => {
      component.form.controls.name.markAsTouched();
      component.form.controls.name.setValue('NAME');
      expect(component.isNameValid).toBeTrue();
    });

    it('returns false if the name control is not touched', () => {
      expect(component.isNameValid).toBeFalse();
    });

    it('returns false if the name control is touched but not valid', () => {
      component.form.controls.name.markAsTouched();
      expect(component.isNameValid).toBeFalse();
    });
  });

  describe('isNameInvalid', () => {
    it('returns true if the name control is touched and not valid', () => {
      component.form.controls.name.markAsTouched();
      component.form.controls.name.setValue('');
      expect(component.isNameInvalid).toBeTrue();
    });

    it('returns false if the name control is not touched', () => {
      expect(component.isNameInvalid).toBeFalse();
    });

    it('returns false if the name control is touched and valid', () => {
      component.form.controls.name.markAsTouched();
      component.form.controls.name.setValue('NAME');
      expect(component.isNameInvalid).toBeFalse();
    });
  });

  describe('isEmailValid', () => {
    it('returns true if the email control is touched and valid', () => {
      component.form.controls.email.markAsTouched();
      component.form.controls.email.setValue('email@test.com');
      expect(component.isEmailValid).toBeTrue();
    });

    it('returns false if the email control is not touched', () => {
      expect(component.isEmailValid).toBeFalse();
    });

    it('returns false if the email control is touched but not valid', () => {
      component.form.controls.email.markAsTouched();
      expect(component.isEmailValid).toBeFalse();
    });
  });

  describe('isEmailInvalid', () => {
    it('returns true if the email control is touched and not valid', () => {
      component.form.controls.email.markAsTouched();
      component.form.controls.email.setValue('');
      expect(component.isEmailInvalid).toBeTrue();
    });

    it('returns false if the email control is not touched', () => {
      expect(component.isEmailInvalid).toBeFalse();
    });

    it('returns false if the email control is touched and valid', () => {
      component.form.controls.email.markAsTouched();
      component.form.controls.email.setValue('email@test.com');
      expect(component.isEmailInvalid).toBeFalse();
    });
  });

  describe('isPasswordValid', () => {
    it('returns true if the password control is touched and valid', () => {
      component.form.controls.password.markAsTouched();
      component.form.controls.password.setValue('passwordPASSWORD123');
      expect(component.isPasswordValid).toBeTrue();
    });

    it('returns false if the password control is not touched', () => {
      expect(component.isPasswordValid).toBeFalse();
    });

    it('returns false if the password control is touched but not valid', () => {
      component.form.controls.password.markAsTouched();
      expect(component.isPasswordValid).toBeFalse();
    });
  });

  describe('isPasswordInvalid', () => {
    it('returns true if the password control is touched and not valid', () => {
      component.form.controls.password.markAsTouched();
      component.form.controls.password.setValue('');
      expect(component.isPasswordInvalid).toBeTrue();
    });

    it('returns false if the password control is not touched', () => {
      expect(component.isPasswordInvalid).toBeFalse();
    });

    it('returns false if the password control is touched and valid', () => {
      component.form.controls.password.markAsTouched();
      component.form.controls.password.setValue('passwordPASSWORD123');
      expect(component.isPasswordInvalid).toBeFalse();
    });
  });

  describe('name', () => {
    it('returns the name FormControl', () => {
      expect(component.name).toBe(component.form.controls.name);
    });
  });

  describe('password', () => {
    it('returns the password FormControl', () => {
      expect(component.password).toBe(component.form.controls.password);
    });
  });

  describe('email', () => {
    it('returns the email FormControl', () => {
      expect(component.email).toBe(component.form.controls.email);
    });
  });

  describe('passwordErrors', () => {
    it('converts the errors object on the password control into a PasswordErrors interface', () => {
      component.form.controls.password.setErrors({
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

  describe('form inputs', () => {
    let nameInput: HTMLInputElement;
    let emailInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    beforeEach(() => {
      nameInput = fixture.debugElement.query(By.css('input[formcontrolname=name]')).nativeElement;
      emailInput = fixture.debugElement.query(By.css('input[formcontrolname=email]')).nativeElement;
      passwordInput = fixture.debugElement.query(By.css('input[formcontrolname=password]')).nativeElement;
    });

    describe('name', () => {
      it('has the class "is-success" when the name control is valid', () => {
        component.form.controls.name.markAsTouched();
        spyOnProperty(component.form.controls.name, 'valid').and.returnValue(true);
        fixture.detectChanges();
        expect(nameInput.classList.contains('is-success')).toBeTrue();
      });

      it('has the class "is-danger" when the name control is invalid', () => {
        component.form.controls.name.markAsTouched();
        spyOnProperty(component.form.controls.name, 'invalid').and.returnValue(true);
        fixture.detectChanges();
        expect(nameInput.classList.contains('is-danger')).toBeTrue();
      });
    });

    describe('email', () => {
      it('has the class "is-success" when the email control is valid', () => {
        component.form.controls.email.markAsTouched();
        spyOnProperty(component.form.controls.email, 'valid').and.returnValue(true);
        fixture.detectChanges();
        expect(emailInput.classList.contains('is-success')).toBeTrue();
      });

      it('has the class "is-danger" when email control is invalid', () => {
        component.form.controls.email.markAsTouched();
        spyOnProperty(component.form.controls.email, 'invalid').and.returnValue(true);
        fixture.detectChanges();
        expect(emailInput.classList.contains('is-danger')).toBeTrue();
      });
    });

    describe('password', () => {
      it('has the class "is-success" when the password control is valid', () => {
        component.form.controls.password.markAsTouched();
        spyOnProperty(component.form.controls.password, 'valid').and.returnValue(true);
        fixture.detectChanges();
        expect(passwordInput.classList.contains('is-success')).toBeTrue();
      });

      it('has the class "is-danger" when the password is invalid', () => {
        component.form.controls.password.markAsTouched();
        spyOnProperty(component.form.controls.password, 'invalid').and.returnValue(true);
        fixture.detectChanges();
        expect(passwordInput.classList.contains('is-danger')).toBeTrue();
      });
    });
  });

  describe('register button', () => {
    let button: HTMLButtonElement;

    beforeEach(() => button = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement);

    it('is disabled when the form is invalid', () => {
      expect(button.disabled).toBeTrue();
    });

    it('is enabled when the form is valid', () => {
      spyOnProperty(component.form, 'invalid').and.returnValue(false);
      fixture.detectChanges();
      expect(button.disabled).toBeFalse();
    });

    it('has the class "is-loading" when isLoading is true', () => {
      expect(button.classList.contains('is-loading')).toBeFalse();
      component.isLoading = true;
      fixture.detectChanges();
      expect(button.classList.contains('is-loading')).toBeTrue();
    });
  });

  describe('onFormSubmit', () => {
    describe('when the form is valid', () => {

      beforeEach(() => {
        spyOnProperty(component.form, 'valid').and.returnValue(true);
        component.form.controls.name.setValue('NAME');
        component.form.controls.email.setValue('EMAIL');
        component.form.controls.password.setValue('PASSWORD');
      });

      it('sets isLoading to true', () => {
        expect(component.isLoading).toBeFalse();
        component.onFormSubmit();
        expect(component.isLoading).toBeTrue();
      });

      it('sets errorNotificationState to "hidden"', () => {
        component.errorNotificationState = 'shown';
        component.onFormSubmit();
        expect(component.errorNotificationState).toBe('hidden');
      });

      it('calls authService.register with the expected arguments', () => {
        component.onFormSubmit();
        expect(authService.register).toHaveBeenCalledWith(
          'EMAIL',
          'PASSWORD',
          'NAME'
        );
      });

      describe('when the registration call succeeds', () => {
        it('sets isLoading to false', () => {
          component.onFormSubmit();
          authService.register.observer.next({});
          expect(component.isLoading).toBeFalse();
        });

        it('navigates the user to the "/home" route', () => {
          component.onFormSubmit();
          authService.register.observer.next({});
          expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
        });
      });

      describe('when the authorization call fails', () => {
        it('sets isLoading to false', () => {
          component.onFormSubmit();
          authService.register.observer.error({});
          expect(component.isLoading).toBeFalse();
        });

        it('sets errorNotificationState to "shown"', () => {
          component.onFormSubmit();
          authService.register.observer.error({});
          expect(component.errorNotificationState).toBe('shown');
        });
      });
    });
  });
});
