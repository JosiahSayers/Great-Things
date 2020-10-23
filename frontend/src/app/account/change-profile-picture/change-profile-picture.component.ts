import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { AccountService } from '@src/app/account/shared/services/account.service';

@Component({
  selector: 'app-change-profile-picture',
  templateUrl: './change-profile-picture.component.html',
  styleUrls: ['./change-profile-picture.component.css']
})
export class ChangeProfilePictureComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  errorNotificationState: 'shown' | 'hidden' = 'hidden';

  constructor(
    private formBuilder: FormBuildersService,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.uploadImageForm();
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorNotificationState = 'hidden';
      this.accountService.changeProfilePicture(this.image.value).subscribe({
        next: () => { this.isLoading = false; this.router.navigateByUrl('/account'); },
        error: () => { this.isLoading = false; this.errorNotificationState = 'shown'; }
      });
    } else {
      console.log(this.form.errors);
    }
  }

  fileSelected(file: File): void {
    this.image.markAsTouched();
    this.image.setValue(file);
  }

  get image(): AbstractControl {
    return this.form.controls.image;
  }

  get disableSubmit(): boolean {
    return !this.form.valid;
  }

}
