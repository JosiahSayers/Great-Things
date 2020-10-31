import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GreatThingsService } from '@src/app/shared/services/great-things/great-things.service';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent {

  quotes: QuoteForTesting[] = [];

  constructor(
    private http: HttpClient,
    private greatThings: GreatThingsService
  ) { }

  addRandomQuote(): void {
    this.http.get(environment.RANDOM_QUOTE_URL).subscribe(({ id, quote }: any) => {
      this.quotes.push({
        id,
        text: quote,
        savedAsGreatThing: false
      });

      this.greatThings.create(quote).subscribe((res) => this.quotes.find((q) => q.id === id).savedAsGreatThing = true);
    });
  }

}

interface QuoteForTesting {
  id: number;
  text: string;
  savedAsGreatThing: boolean;
}
