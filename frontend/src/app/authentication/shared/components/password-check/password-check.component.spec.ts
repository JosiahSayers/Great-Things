import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordCheckComponent } from '@src/app/authentication/shared/components/password-check/password-check.component';
import { MockComponent } from 'ng-mocks';
import { PassFailListItemComponent } from '../../../../components/pass-fail-list-item/pass-fail-list-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('PasswordCheckComponent', () => {
  let component: PasswordCheckComponent;
  let fixture: ComponentFixture<PasswordCheckComponent>;
  let passFailElements: DebugElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PasswordCheckComponent,
        MockComponent(PassFailListItemComponent)
      ],
      imports: [BrowserAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordCheckComponent);
    component = fixture.componentInstance;
    component.errors = {
      required: true,
      minlength: true,
      lowerCase: true,
      upperCase: true,
      numbers: true
    };
    fixture.detectChanges();
    passFailElements = fixture.debugElement.queryAll(By.css('app-pass-fail-list-item'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates 4 pass fail components', () => {
    expect(passFailElements.length).toBe(4);
  });

  describe('minlength', () => {
    let minlength: PassFailListItemComponent;

    beforeEach(() => {
      minlength = passFailElements.filter(el =>
        (<HTMLElement>el.nativeElement).innerText.trim() === 'Minimum of 8 characters')[0].componentInstance;
    });

    it('sets passing to true if minlength and required errors are false', () => {
      component.errors.minlength = false;
      component.errors.required = false;
      fixture.detectChanges();
      expect(minlength.passing).toBe(true);
    });
  });

  describe('lowercase', () => {
    let lowercase: PassFailListItemComponent;

    beforeEach(() => {
      lowercase = passFailElements.filter(el =>
        (<HTMLElement>el.nativeElement).innerText.trim() === 'Must contain a lowercase letter')[0].componentInstance;
    });

    it('sets passing to true if lowercase error is false', () => {
      component.errors.lowerCase = false;
      fixture.detectChanges();
      expect(lowercase.passing).toBe(true);
    });
  });

  describe('uppercase', () => {
    let uppercase: PassFailListItemComponent;

    beforeEach(() => {
      uppercase = passFailElements.filter(el =>
        (<HTMLElement>el.nativeElement).innerText.trim() === 'Must contain an uppercase letter')[0].componentInstance;
    });

    it('sets passing to true if uppercase error is false', () => {
      component.errors.upperCase = false;
      fixture.detectChanges();
      expect(uppercase.passing).toBe(true);
    });
  });

  describe('number', () => {
    let number: PassFailListItemComponent;

    beforeEach(() => {
      number = passFailElements.filter(el =>
        (<HTMLElement>el.nativeElement).innerText.trim() === 'Must contain a number')[0].componentInstance;
    });

    it('sets passing to true if number error is false', () => {
      component.errors.numbers = false;
      fixture.detectChanges();
      expect(number.passing).toBe(true);
    });
  });
});
