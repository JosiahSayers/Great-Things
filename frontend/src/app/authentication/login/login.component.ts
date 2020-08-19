import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuildersService } from '../shared/forms/form-builders.service';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuildersService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.loginForm();
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      this.authService.login(this.email, this.password).subscribe(() => console.log('LOGGED IN!'));
    }
  }

  get email(): string {
    return this.form?.controls?.email?.value ?? '';
  }

  get password(): string {
    return this.form?.controls?.password?.value ?? '';
  }

}
