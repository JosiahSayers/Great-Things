import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from '@src/app/authentication/login/login.component';
import { FormBuildersService } from '../shared/forms/form-builders.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Spied } from '../../utils/testing/spied.interface';
import { spyOnClass } from '../../utils/testing/helper-functions';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let formBuilder: FormBuildersService;
  let authService: Spied<AuthService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuildersService,
        {
          provide: AuthService,
          useFactory: () => authService = spyOnClass(AuthService, ['login'])
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    formBuilder = TestBed.inject(FormBuildersService);
    spyOn(formBuilder, 'loginForm').and.callThrough();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    authService.cleanupObservables();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls the loginForm method of form builder to set it\'s form', () => {
    expect(formBuilder.loginForm).toHaveBeenCalledWith();
    expect(formBuilder.loginForm).toHaveBeenCalledTimes(1);
  });

  describe('email', () => {
    it('returns the value of the email input when it is defined', () => {
      component.form.controls.email.setValue('EMAIL');
      expect(component.email).toBe('EMAIL');
    });

    it('returns an empty string if any part of the email input is nullish', () => {
      component.form.removeControl('email');
      expect(component.email).toBe('');
    });
  });

  describe('password', () => {
    it('returns the value of the password input when it is defined', () => {
      component.form.controls.password.setValue('PASSWORD');
      expect(component.password).toBe('PASSWORD');
    });

    it('returns an empty string if any part of the password input is nullish', () => {
      component.form.removeControl('password');
      expect(component.password).toBe('');
    });
  });

  describe('Log in button', () => {
    let button: HTMLButtonElement;

    beforeEach(() => button = fixture.debugElement.query(By.css('button')).nativeElement);

    it('is disabled when the form is not valid', () => {
      expect(button.disabled).toBeTrue();
    });

    it('is not disabled when the form is valid', () => {
      component.form.controls.email.setValue('VALID@EMAIL.COM');
      component.form.controls.password.setValue('PASSWORD');
      fixture.detectChanges();
      expect(button.disabled).toBeFalse();
    });

    it('has the class "is-loading" when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();
      expect(button.classList.contains('is-loading')).toBeTrue();
    });

    it('does not have the class "is-loading" when isLoading is false', () => {
      expect(button.classList.contains('is-loading')).toBeFalse();
    });

    it('submits the login request when it is clicked and the form is valid', () => {
      component.form.controls.email.setValue('VALID@EMAIL.COM');
      component.form.controls.password.setValue('PASSWORD');
      fixture.detectChanges();
      button.click();
      expect(authService.login).toHaveBeenCalled();
    });

    it('does not submit the login request when it is clicked and the form is invalid', () => {
      button.click();
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('onFormSubmit', () => {
    it('does nothing if the form is invalid', () => {
      component.onFormSubmit();
      expect(component.isLoading).toBeFalse();
      expect(authService.login).not.toHaveBeenCalled();
    });

    describe('when the form is valid', () => {
      beforeEach(() => {
        component.form.controls.email.setValue('VALID@EMAIL.COM');
        component.form.controls.password.setValue('PASSWORD');
      });

      it('sets isLoading to true', () => {
        component.onFormSubmit();
        expect(component.isLoading).toBeTrue();
      });

      it('calls the auth service with the form values', () => {
        component.onFormSubmit();
        expect(authService.login).toHaveBeenCalledWith('VALID@EMAIL.COM', 'PASSWORD');
      });

      it('sets isLoading to false when the login call returns', () => {
        component.onFormSubmit();
        authService.login.observer.next({});
        expect(component.isLoading).toBeFalse();
      });

      it('sets isLoading to false when the login call errors', () => {
        component.onFormSubmit();
        authService.login.observer.error({});
        expect(component.isLoading).toBeFalse();
      });
    });
  });
});
