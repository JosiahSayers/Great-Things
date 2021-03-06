import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { AuthService } from '@src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  errorNotificationState: 'shown' | 'hidden' = 'hidden';

  constructor(
    private formBuilder: FormBuildersService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.loginForm();
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorNotificationState = 'hidden';
      this.authService.login(this.email, this.password).subscribe({
        next: () => { this.isLoading = false; this.router.navigateByUrl('/home'); },
        error: () => { this.isLoading = false; this.errorNotificationState = 'shown'; }
      });
    }
  }

  get email(): string {
    return this.form?.controls?.email?.value ?? '';
  }

  get password(): string {
    return this.form?.controls?.password?.value ?? '';
  }

}
