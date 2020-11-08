import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { GreatThingsService } from '@src/app/shared/services/great-things/great-things.service';
import { GreatThingsCacheService } from '../shared/services/great-things-cache/great-things-cache.service';

@Component({
  selector: 'app-create-great-thing',
  templateUrl: './create-great-thing.component.html',
  styleUrls: ['./create-great-thing.component.scss']
})
export class CreateGreatThingComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuildersService,
    private greatThings: GreatThingsService,
    private cache: GreatThingsCacheService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.greatThing();
  }

  onSubmitClick(): void {
    if (this.form.valid) {
      this.greatThings.create(this.form.controls.text.value).subscribe({
        next: (res) => this.cache.addGreatThings([res]),
        error: (err) => console.log(err)
      });
    }
  }

  get shouldDisableSubmit(): boolean {
    return !this.form.valid;
  }

}
