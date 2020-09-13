import { Component, OnInit, Input } from '@angular/core';
import { GreatThing } from '../../shared/models/GreatThing.model';

@Component({
  selector: 'app-great-things-tiles',
  templateUrl: './great-things-tiles.component.html',
  styleUrls: ['./great-things-tiles.component.css']
})
export class GreatThingsTilesComponent implements OnInit {

  @Input() greatThings: GreatThing[];

  constructor() { }

  ngOnInit(): void {
  }

}
