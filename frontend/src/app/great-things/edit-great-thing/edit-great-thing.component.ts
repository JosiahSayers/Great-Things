import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GreatThing } from '@src/app/shared/models/GreatThing.model';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { GreatThingsService } from '@src/app/shared/services/great-things/great-things.service';
import { ModalService } from '@src/app/shared/services/modal/modal.service';

@Component({
  selector: 'app-edit-great-thing',
  templateUrl: './edit-great-thing.component.html',
  styleUrls: ['./edit-great-thing.component.scss']
})
export class EditGreatThingComponent implements OnInit {

  @Input() greatThing: GreatThing;
  @Output() toggleEditing = new EventEmitter<void>();
  form: FormGroup;
  errorNotificationState: 'shown' | 'hidden' = 'hidden';

  constructor(
    private formBuilder: FormBuildersService,
    private greatThingService: GreatThingsService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.greatThing(this.greatThing.text);
  }

  emitToggleEditing(): void {
    this.toggleEditing.emit();
  }

  confirmDelete(): void {
    const sub = this.modalService.openAreYouSureModal().subscribe({
      next: (choice) => {
        sub.unsubscribe();
        if (choice === 'confirm') {
          this.delete();
        }
      }
    });
  }

  private delete(): void {
    this.errorNotificationState = 'hidden';
    this.greatThingService.remove(this.greatThing.id).subscribe({
      next: () => this.emitToggleEditing(),
      error: () => this.errorNotificationState = 'shown'
    });
  }

  sendUpdateApiRequest(): void {
    if (this.form.valid) {
      this.errorNotificationState = 'hidden';
      this.greatThingService.edit({
        id: this.greatThing.id,
        text: this.form.controls.text.value
      }).subscribe({
        next: () => this.emitToggleEditing(),
        error: () => this.errorNotificationState = 'shown'
      });
    }
  }

}
