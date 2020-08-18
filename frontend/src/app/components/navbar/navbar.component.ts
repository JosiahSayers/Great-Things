import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
    private auth: AuthService
  ) {
    this.hamburgerState = 'closed';
  }

  hamburgerClick(event): void {
    const hamburgerElement = <HTMLElement>event.target;
    const menuElement = <HTMLElement>document.querySelector(`#${event.target.dataset.target}`);
    hamburgerElement.classList.toggle('is-active');
    menuElement.classList.toggle('is-active');

    this.hamburgerState = hamburgerElement.classList.contains('is-active') ? 'open' : 'closed';
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}
