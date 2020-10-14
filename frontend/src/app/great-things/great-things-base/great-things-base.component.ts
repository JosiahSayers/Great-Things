import { Component, OnInit } from '@angular/core';
import { GreatThingsService } from '../../shared/services/great-things/great-things.service';
import { GreatThing } from '../../shared/models/GreatThing.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-great-things-base',
  templateUrl: './great-things-base.component.html',
  styleUrls: ['./great-things-base.component.css']
})
export class GreatThingsBaseComponent implements OnInit {

  greatThings$: Observable<GreatThing[]>;

  constructor(
    private greatThingsService: GreatThingsService
  ) { }

  ngOnInit(): void {
    this.greatThings$ = this.greatThingsService.retrieve({
      limit: 30
    });
  }

}
