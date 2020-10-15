import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-navbar-user-info',
  templateUrl: './navbar-user-info.component.html',
  styleUrls: ['./navbar-user-info.component.css']
})
export class NavbarUserInfoComponent {

  constructor(
    private auth: AuthService
  ) { }

  get firstName(): string {
    return this.auth.firstName;
  }

}
