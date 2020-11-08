import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable()
export class FormBuildersService {

  registerForm(): FormGroup {
    return new FormGroup({
      name: this.newNameControl(),
      email: this.newEmailControl(),
      password: this.newPasswordControl()
    });
  }

  loginForm(): FormGroup {
    return new FormGroup({
      email: this.newEmailControl(),
      password: this.newPasswordControl(false)
    });
  }

  changeNameForm(currentName: string): FormGroup {
    return new FormGroup({
      name: this.newNameControl(currentName)
    });
  }

  changePasswordForm(): FormGroup {
    return new FormGroup({
      currentPassword: this.newPasswordControl(false),
      newPassword: this.newPasswordControl()
    });
  }

  uploadImageForm(): FormGroup {
    return new FormGroup({
      image: this.newImageControl()
    });
  }

  greatThing(currentText?: string): FormGroup {
    return new FormGroup({
      text: this.newGreatThingTextControl(currentText)
    });
  }

  private newGreatThingTextControl(currentValue?: string): FormControl {
    return new FormControl(currentValue || '', [
      Validators.required
    ]);
  }

  private newImageControl(): FormControl {
    return new FormControl(null, [
      Validators.required
    ]);
  }

  private newNameControl(currentValue?: string): FormControl {
    return new FormControl(currentValue || '', [
      Validators.required,
      Validators.maxLength(35)
    ]);
  }

  private newEmailControl(): FormControl {
    return new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    ]);
  }

  private newPasswordControl(registrationValidators = true): FormControl {
    const validators = registrationValidators ? [
      Validators.required,
      Validators.minLength(8),
      this.lowerCaseValidator(),
      this.upperCaseValidator(),
      this.numberValidator()
    ] : [Validators.required];

    return new FormControl('', validators);
  }

  private lowerCaseValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const containsLowerCase = /[a-z]/.test(control.value);
      return !containsLowerCase ? { lowerCase: { value: control.value } } : null;
    };
  }

  private upperCaseValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const containsUpperCase = /[A-Z]/.test(control.value);
      return !containsUpperCase ? { upperCase: { value: control.value } } : null;
    };
  }

  private numberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const containsNumbers = /[0-9]/.test(control.value);
      return !containsNumbers ? { numbers: { value: control.value } } : null;
    };
  }
}

export interface PasswordErrors {
  required: boolean;
  minlength: boolean;
  lowerCase: boolean;
  upperCase: boolean;
  numbers: boolean;
}
