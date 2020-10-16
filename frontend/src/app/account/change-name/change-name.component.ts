import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { AuthService } from '@src/app/shared/services/auth/auth.service';
import { AccountService } from '@src/app/account/shared/services/account.service';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.css']
})
export class ChangeNameComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  errorNotificationState: 'shown' | 'hidden' = 'hidden';

  constructor(
    private formBuilder: FormBuildersService,
    private accountService: AccountService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.changeNameForm(this.auth.fullName());
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorNotificationState = 'hidden';
      this.accountService.update({ name: this.name }).subscribe({
        next: () => { this.isLoading = false; this.router.navigateByUrl('/account'); },
        error: () => { this.isLoading = false; this.errorNotificationState = 'shown'; }
      });
    }
  }

  get name(): string {
    return this.form.controls.name.value;
  }

  get disableSubmit(): boolean {
    return this.form.invalid || this.name === this.auth.fullName();
  }

}
