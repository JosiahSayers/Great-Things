import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  hamburgerClick(event): void {
    const hamburgerElement = event.target;
    const menuElement = document.querySelector(`#${event.target.dataset.target}`);
    hamburgerElement.classList.toggle('is-active');
    menuElement.classList.toggle('is-active');
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}
