import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from '@src/app/shared/components/navbar/navbar.component';
import { AuthService } from '../../services/auth/auth.service';
import { Spied } from '../../../utils/testing/spied.interface';
import { spyOnClass } from '../../../utils/testing/helper-functions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { NavbarUserInfoComponent } from './navbar-user-info/navbar-user-info.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: Spied<AuthService>;
  const mockWindow = { innerWidth: 1024 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavbarComponent,
        MockComponent(NavbarUserInfoComponent)
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: AuthService,
          useFactory: () => authService = spyOnClass(AuthService)
        },
        {
          provide: 'window',
          useValue: mockWindow
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleMenuState', () => {
    let hamburger: HTMLElement;
    let menu: HTMLElement;

    beforeEach(() => {
      hamburger = fixture.debugElement.query(By.css('#navbar-burger')).nativeElement;
      menu = fixture.debugElement.query(By.css(`#${hamburger.dataset.target}`)).nativeElement;
    });

    describe('when input is "open"', () => {
      it('adds the class "is-active" to the hamburger and menu elements', () => {
        component.toggleMenuState('open');
        expect(hamburger.classList.contains('is-active')).toBeTrue();
        expect(menu.classList.contains('is-active')).toBeTrue();
      });
    });

    describe('when input is "closed"', () => {
      it('removes the class "is-active" to the hamburger and menu elements', () => {
        component.toggleMenuState('closed');
        expect(hamburger.classList.contains('is-active')).toBeFalse();
        expect(menu.classList.contains('is-active')).toBeFalse();
      });
    });

    describe('when input is not "open" or "closed"', () => {
      it('toggles the class "is-active" to the hamburger and menu elements', () => {
        const initialHamburger = hamburger.classList.contains('is-active');
        const initialMenu = menu.classList.contains('is-active');
        component.toggleMenuState();
        expect(hamburger.classList.contains('is-active')).toBe(!initialHamburger);
        expect(menu.classList.contains('is-active')).toBe(!initialMenu);
      });
    });

    describe('when mobile view is active', () => {
      it('sets hamburger state to open if the hamburger element has the class "is-active"', () => {
        mockWindow.innerWidth = 50;
        component.toggleMenuState('open');
        expect(component.hamburgerState).toBe('open');
      });

      it('sets hamburger state to closed if the hamburger element doesn\'t have the class "is-active"', () => {
        mockWindow.innerWidth = 50;
        component.toggleMenuState('closed');
        expect(component.hamburgerState).toBe('closed');
      });
    });
  });

  describe('setHamburgerStateOnResize', () => {
    it('sets hamburger state to closed if mobile view is active', () => {
      mockWindow.innerWidth = 1023;
      component.setHamburgerStateOnResize();
      expect(component.hamburgerState).toBe('closed');
    });

    it('sets hamburger state to open if mobile view is not active', () => {
      mockWindow.innerWidth = 1024;
      component.setHamburgerStateOnResize();
      expect(component.hamburgerState).toBe('open');
    });
  });

  describe('isMobileView', () => {
    it('returns true if window.innerWidth is less than 1024', () => {
      mockWindow.innerWidth = 1023;
      expect(component.isMobileView).toBeTrue();
    });

    it('returns false if window.innerWidth is greater than or equal to 1024', () => {
      mockWindow.innerWidth = 1024;
      expect(component.isMobileView).toBeFalse();
      mockWindow.innerWidth = 1025;
      expect(component.isMobileView).toBeFalse();
    });
  });

  describe('isLoggedIn', () => {
    it('returns the value of AuthService.isLoggedIn', () => {
      authService.isLoggedIn.and.returnValue(true);
      expect(component.isLoggedIn).toBeTrue();
    });
  });
});
