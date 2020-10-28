import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  photoHref: string;
  name: string;
  email: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.photoHref = this.auth.photoHref();
    this.name = this.auth.fullName();
    this.email = this.auth.emailAddress();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

}
