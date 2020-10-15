import { Component, OnInit } from '@angular/core';
import { AuthService } from '@src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  photoHref: string;
  name: string;
  email: string;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.photoHref = this.auth.photoHref();
    this.name = this.auth.fullName();
    this.email = this.auth.emailAddress();
  }

}
