import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationBaseComponent } from '@src/app/authentication/authentication-base/authentication-base.component';

describe('AuthenticationBaseComponent', () => {
  let component: AuthenticationBaseComponent;
  let fixture: ComponentFixture<AuthenticationBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
