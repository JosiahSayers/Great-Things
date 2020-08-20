import { Component, Inject, HostListener } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        maxHeight: '500px',
        opacity: '100%'
      })),
      state('closed', style({
        maxHeight: '0px',
        opacity: '0%'
      })),
      transition('open => closed', [
        animate('0.2s ease-in')
      ]),
      transition('closed => open', [
        animate('0.2s ease-out')
      ]),
    ]),
  ],
})
export class NavbarComponent {

  hamburgerState: 'open' | 'closed';

  constructor(
    private auth: AuthService,
    @Inject('window') private window: Window,
    private router: Router
  ) {
    this.setHamburgerStateOnResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setHamburgerStateOnResize();
  }

  toggleMenuState(stateToSet?: 'open' | 'closed'): void {
    const hamburgerElement = <HTMLElement>document.querySelector('#navbar-burger');
    const menuElement = <HTMLElement>document.querySelector(`#${hamburgerElement.dataset.target}`);

    if (stateToSet === 'open') {
      hamburgerElement?.classList.add('is-active');
      menuElement?.classList.add('is-active');
    } else if (stateToSet === 'closed') {
      hamburgerElement?.classList.remove('is-active');
      menuElement?.classList.remove('is-active');
    } else {
      hamburgerElement?.classList.toggle('is-active');
      menuElement?.classList.toggle('is-active');
    }

    if (this.isMobileView) {
      this.hamburgerState = hamburgerElement?.classList.contains('is-active') ? 'open' : 'closed';
    }
  }

  setHamburgerStateOnResize(): void {
    this.hamburgerState = this.isMobileView ? 'closed' : 'open';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  get isMobileView(): boolean {
    return this.window.innerWidth < 1024;
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}
