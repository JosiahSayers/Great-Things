import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  title = 'great-things';

  constructor(
    private authService: AuthService
  ) { }

  login(): void {
    this.authService.login('josiah.sayers15@gmail.com', '3C0ZB$klqYpSmkVU!1hYO!^W').subscribe(() => {
      console.log(this.authService.jwt);
    });
  }

  refresh(): void {
    this.authService.refreshJwt().subscribe(() => console.log(this.authService.jwt));
  }
}
