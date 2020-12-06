import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { GreatThingsService } from '@src/app/shared/services/great-things/great-things.service';

@Component({
  selector: 'app-create-great-thing',
  templateUrl: './create-great-thing.component.html',
  styleUrls: ['./create-great-thing.component.scss']
})
export class CreateGreatThingComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  errorNotificationState: 'shown' | 'hidden' = 'hidden';

  constructor(
    private formBuilder: FormBuildersService,
    private greatThings: GreatThingsService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.greatThing();
  }

  onSubmitClick(): void {
    if (this.form.valid) {
      this.errorNotificationState = 'hidden';
      this.isLoading = true;
      this.greatThings.create(this.form.controls.text.value).subscribe({
        next: () => {
          this.form.reset();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.errorNotificationState = 'shown';
        }
      });
    }
  }

  get shouldDisableSubmit(): boolean {
    return !this.form.valid;
  }

}
