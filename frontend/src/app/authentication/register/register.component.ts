import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormBuildersService, PasswordErrors } from '../shared/forms/form-builders.service';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuildersService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.registerForm();
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      this.authService.register(this.email.value, this.password.value, this.name.value).subscribe(() => console.log('Registered!'));
    }
  }

  get isNameValid(): boolean {
    return this.name?.touched && this.name?.valid;
  }

  get isNameInvalid(): boolean {
    return this.name?.touched && !this.name?.valid;
  }

  get isEmailValid(): boolean {
    return this.email?.touched && this.email?.valid;
  }

  get isEmailInvalid(): boolean {
    return this.email?.touched && !this.email?.valid;
  }

  get isPasswordValid(): boolean {
    return this.password?.touched && this.password?.valid;
  }

  get isPasswordInvalid(): boolean {
    return this.password?.touched && !this.password?.valid;
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
