import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
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
          useFactory: () => accountService = spyOnClass(AccountService)
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function stubForm(): void {
    formBuilder.changeNameForm.and.returnValue(new FormGroup({
      name: new FormControl()
    }));
  }
});
