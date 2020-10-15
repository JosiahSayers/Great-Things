import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewComponent } from '@src/app/account/overview/overview.component';
import { AuthService } from '../../shared/services/auth/auth.service';
import { spyOnClass } from '../../utils/testing/helper-functions';
import { Spied } from '../../utils/testing/spied.interface';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let auth: Spied<AuthService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewComponent],
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
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('pulls data from the auth service on init', () => {
    auth.photoHref.and.returnValue('PHOTO HREF');
    auth.fullName.and.returnValue('FULL NAME');
    auth.emailAddress.and.returnValue('EMAIL ADDRESS');
    fixture.detectChanges();
    expect(component.photoHref).toBe('PHOTO HREF');
    expect(component.name).toBe('FULL NAME');
    expect(component.email).toBe('EMAIL ADDRESS');
  });
});
