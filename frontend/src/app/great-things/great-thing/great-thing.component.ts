import { Component, Input } from '@angular/core';
import { GreatThing } from '../../shared/models/GreatThing.model';

@Component({
  selector: 'app-great-thing',
  templateUrl: './great-thing.component.html',
  styleUrls: ['./great-thing.component.css']
})
export class GreatThingComponent {

  @Input() greatThing: GreatThing;
  editing = false;

  toggleEditing(): void {
    this.editing = !this.editing;
  }

}
