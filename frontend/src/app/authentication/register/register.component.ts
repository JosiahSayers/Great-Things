import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormBuildersService, PasswordErrors } from '@src/app/shared/services/forms/form-builders.service';
import { AuthService } from '@src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  errorNotificationState: 'shown' | 'hidden' = 'hidden';

  constructor(
    private formBuilder: FormBuildersService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.registerForm();
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorNotificationState = 'hidden';
      this.authService.register(this.email.value, this.password.value, this.name.value).subscribe({
        next: () => { this.isLoading = false; this.router.navigateByUrl('/home'); },
        error: () => { this.isLoading = false; this.errorNotificationState = 'shown'; }
      });
    }
  }

  get isNameValid(): boolean {
    return this.name?.touched && this.name?.valid;
  }

  get isNameInvalid(): boolean {
    return this.name?.touched && this.name?.invalid;
  }

  get isEmailValid(): boolean {
    return this.email?.touched && this.email?.valid;
  }

  get isEmailInvalid(): boolean {
    return this.email?.touched && this.email?.invalid;
  }

  get isPasswordValid(): boolean {
    return this.password?.touched && this.password?.valid;
  }

  get isPasswordInvalid(): boolean {
    return this.password?.touched && this.password?.invalid;
  }

  get name(): AbstractControl {
    return this.form?.controls?.name;
  }

  get password(): AbstractControl {
    return this.form?.controls?.password;
  }

  get email(): AbstractControl {
    return this.form?.controls?.email;
  }

  get passwordErrors(): PasswordErrors {
    const errors = this.password?.errors ?? {};
    return {
      required: !!errors.required,
      minlength: !!errors.minlength,
      lowerCase: !!errors.lowerCase,
      upperCase: !!errors.upperCase,
      numbers: !!errors.numbers
    };
  }
}
