import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PassFailListItemComponent } from '@src/app/shared/components/pass-fail-list-item/pass-fail-list-item.component';
import { MockComponent } from 'ng-mocks';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCheckSquare, faBan } from '@fortawesome/free-solid-svg-icons';

describe('PassFailListItemComponent', () => {
  let component: PassFailListItemComponent;
  let fixture: ComponentFixture<PassFailListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PassFailListItemComponent,
        MockComponent(FaIconComponent)
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassFailListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('currentIcon', () => {
    it('returns faCheckSquare when passing is true', () => {
      component.passing = true;
      expect(component.currentIcon).toBe(faCheckSquare);
    });

    it('returns faBan when passing is false', () => {
      component.passing = false;
      expect(component.currentIcon).toBe(faBan);
    });
  });

  describe('currentTextClass', () => {
    it('returns "has-text-success" when passing is true', () => {
      component.passing = true;
      expect(component.currentTextClass).toBe('has-text-success');
    });

    it('returns "has-text-danger" when passing is false', () => {
      component.passing = false;
      expect(component.currentTextClass).toBe('has-text-danger');
    });
  });
});
