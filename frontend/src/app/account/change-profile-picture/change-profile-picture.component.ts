import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { AccountService } from '../shared/services/account.service';

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

  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image.setValue(file);
    }
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.errorNotificationState = 'hidden';
      this.accountService.changeProfilePicture(this.image.value).subscribe({
        next: () => { this.isLoading = false; this.router.navigateByUrl('/account'); },
        error: () => { this.isLoading = false; this.errorNotificationState = 'shown'; }
      });
    }
  }

  get image(): AbstractControl {
    return this.form.controls.image;
  }

}
