import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuildersService, PasswordErrors } from '@src/app/shared/services/forms/form-builders.service';
import { AccountService } from '@src/app/account/shared/services/account.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  errorNotificationState: 'shown' | 'hidden' = 'hidden';

  constructor(
    private formBuilder: FormBuildersService,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.changePasswordForm();
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorNotificationState = 'hidden';
      this.accountService.update({ currentPassword: this.currentPassword.value, newPassword: this.newPassword.value }).subscribe({
        next: () => { this.isLoading = false; this.router.navigateByUrl('/account'); },
        error: () => { this.isLoading = false; this.errorNotificationState = 'shown'; }
      });
    }
  }

  get currentPassword(): AbstractControl {
    return this.form?.controls?.currentPassword;
  }

  get isCurrentPasswordInvalid(): boolean {
    return this.currentPassword.touched && this.currentPassword.invalid;
  }

  get newPassword(): AbstractControl {
    return this.form?.controls?.newPassword;
  }

  get isNewPasswordValid(): boolean {
    return this.newPassword.touched && this.newPassword.valid;
  }

  get isNewPasswordInvalid(): boolean {
    return this.newPassword.touched && this.newPassword.invalid;
  }

  get passwordErrors(): PasswordErrors {
    const errors = this.newPassword?.errors ?? {};
    return {
      required: !!errors.required,
      minlength: !!errors.minlength,
      lowerCase: !!errors.lowerCase,
      upperCase: !!errors.upperCase,
      numbers: !!errors.numbers
    };
  }

}
