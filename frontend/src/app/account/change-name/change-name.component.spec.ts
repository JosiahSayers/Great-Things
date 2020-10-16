import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeNameComponent } from '@src/app/account/change-name/change-name.component';
import { MockComponent } from 'ng-mocks';
import { ErrorNotificationComponent } from '../../shared/components/error-notification/error-notification.component';
import { AuthService } from '../../shared/services/auth/auth.service';
import { FormBuildersService } from '../../shared/services/forms/form-builders.service';
import { spyOnClass } from '../../utils/testing/helper-functions';
import { Spied } from '../../utils/testing/spied.interface';
import { AccountService } from '../shared/services/account.service';

describe('ChangeNameComponent', () => {
  let component: ChangeNameComponent;
  let fixture: ComponentFixture<ChangeNameComponent>;
  let formBuilder: Spied<FormBuildersService>;
  let accountService: Spied<AccountService>;
  let router: Spied<Router>;
  let auth: Spied<AuthService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        ChangeNameComponent,
        MockComponent(ErrorNotificationComponent)
      ],
      providers: [
        {
          provide: FormBuildersService,
          useFactory: () => formBuilder = spyOnClass(FormBuildersService)
        },
        {
          provide: AccountService,
          useFactory: () => accountService = spyOnClass(AccountService, [
            'update'
          ])
        },
        {
          provide: Router,
          useFactory: () => router = spyOnClass(Router)
        },
        {
          provide: AuthService,
          useFactory: () => auth = spyOnClass(AuthService)
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeNameComponent);
    component = fixture.componentInstance;
    stubForm();
    fixture.detectChanges();
  });

  afterEach(() => accountService.cleanupObservables());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('grabs the user\'s name from the auth service and passes it to the form creation call', () => {
      expect(formBuilder.changeNameForm).toHaveBeenCalledWith('FULL NAME');
    });
  });

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
        component.onFormSubmit();
        expect(accountService.update).toHaveBeenCalledWith({ name: 'FULL NAME' });
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

  describe('name', () => {
    it('returns the value of the form control', () => {
      expect(component.name).toBe('FULL NAME');
    });
  });

  describe('disableSubmit', () => {
    it('returns true when the form is invalid', () => {
      spyOnProperty(component.form, 'invalid').and.returnValue(true);
      expect(component.disableSubmit).toBeTrue();
    });

    it('returns true when the form is valid but the name has not been changed', () => {
      spyOnProperty(component.form, 'invalid').and.returnValue(false);
      expect(component.disableSubmit).toBeTrue();
    });

    it('returns false when the form is valid and the name has been changed', () => {
      component.form.controls.name.setValue('NEW NAME');
      spyOnProperty(component.form, 'invalid').and.returnValue(false);
      expect(component.disableSubmit).toBeFalse();
    });
  });

  function stubForm(): void {
    auth.fullName.and.returnValue('FULL NAME');
    formBuilder.changeNameForm.and.returnValue(new FormGroup({
      name: new FormControl('FULL NAME')
    }));
  }
});
