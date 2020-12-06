import { Component, OnInit } from '@angular/core';
import { GreatThing } from '../../shared/models/GreatThing.model';
import { GreatThingsService } from '../../shared/services/great-things/great-things.service';
import { GreatThingsCacheService } from '../shared/services/great-things-cache/great-things-cache.service';

@Component({
  selector: 'app-great-things-base',
  templateUrl: './great-things-base.component.html',
  styleUrls: ['./great-things-base.component.scss']
})
export class GreatThingsBaseComponent implements OnInit {

  loading = true;
  currentPage = 0;

  constructor(
    private greatThingsService: GreatThingsService,
    private cache: GreatThingsCacheService
  ) { }

  ngOnInit(): void {
    this.retrieveNext();
  }

  onScroll(): void {
    this.retrieveNext();
  }

  private retrieveNext(): void {
    this.currentPage++;
    this.loading = true;
    this.greatThingsService.retrieve({ page: this.currentPage }).subscribe({
      next: () => this.loading = false,
      error: (res) => console.error(res)
    });
  }

  get greatThings(): GreatThing[] {
    return this.cache.greatThings;
  }

}
