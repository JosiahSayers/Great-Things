import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
      password: this.newPasswordControl()
    });
  }

  private newNameControl(): FormControl {
    return new FormControl('', [Validators.required]);
  }

  private newEmailControl(): FormControl {
    return new FormControl('', [Validators.required]);
  }

  private newPasswordControl(): FormControl {
    return new FormControl('', [Validators.required]);
  }
}
