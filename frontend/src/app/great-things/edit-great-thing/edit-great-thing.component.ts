import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GreatThing } from '@src/app/shared/models/GreatThing.model';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { GreatThingsService } from '@src/app/shared/services/great-things/great-things.service';
import { GreatThingsCacheService } from '../shared/services/great-things-cache/great-things-cache.service';

@Component({
  selector: 'app-edit-great-thing',
  templateUrl: './edit-great-thing.component.html',
  styleUrls: ['./edit-great-thing.component.css']
})
export class EditGreatThingComponent implements OnInit {

  @Input() greatThing: GreatThing;
  @Output() toggleEditing = new EventEmitter<void>();
  form: FormGroup;

  constructor(
    private formBuilder: FormBuildersService,
    private cache: GreatThingsCacheService,
    private greatThingService: GreatThingsService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.editGreatThing(this.greatThing.text);
  }

  emitToggleEditing(): void {
    this.toggleEditing.emit();
  }

  sendApiRequests(): void {
    this.greatThingService.edit({
      id: this.greatThing.id,
      text: this.form.controls.text.value
    }).subscribe({
      next: (res) => {
        console.log(res);
        this.emitToggleEditing();
      },
      error: (err) => console.error(err)
    });
    //   this.cache.updateGreatThing(<any>{
    //     ...this.greatThing,
    //     text: this.form.controls.text.value
    //   });
    // this.emitToggleEditing();
  }

}
