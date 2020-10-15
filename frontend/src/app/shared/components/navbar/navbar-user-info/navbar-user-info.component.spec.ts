import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUserInfoComponent } from '@src/app/shared/components/navbar/navbar-user-info/navbar-user-info.component';
import { spyOnClass } from '../../../../utils/testing/helper-functions';
import { Spied } from '../../../../utils/testing/spied.interface';
import { AuthService } from '../../../services/auth/auth.service';

describe('NavbarUserInfoComponent', () => {
  let component: NavbarUserInfoComponent;
  let fixture: ComponentFixture<NavbarUserInfoComponent>;
  let auth: Spied<AuthService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarUserInfoComponent],
      providers: [
        {
          provide: AuthService,
          useFactory: () => auth = spyOnClass(AuthService)
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
