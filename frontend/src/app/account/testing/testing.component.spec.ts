import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingComponent } from '@src/app/account/testing/testing.component';
import { GreatThingsService } from '@src/app/shared/services/great-things/great-things.service';
import { spyOnClass } from '@src/app/utils/testing/helper-functions';
import { Spied } from '@src/app/utils/testing/spied.interface';
import { environment } from '@src/environments/environment';

describe('TestingComponent', () => {
  let component: TestingComponent;
  let fixture: ComponentFixture<TestingComponent>;
  let http: HttpTestingController;
  let greatThings: Spied<GreatThingsService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestingComponent],
      providers: [
        {
          provide: GreatThingsService,
          useFactory: () => greatThings = spyOnClass(GreatThingsService, [
            'create'
          ])
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    greatThings.cleanupObservables();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addRandomQuote', () => {
    const testQuote = { id: 1, quote: 'QUOTE' };

    it('should call the random quote API', () => {
      component.addRandomQuote();
      const req = http.expectOne(environment.RANDOM_QUOTE_URL).request;
      expect(req.method).toBe('GET');
    });

    it('should add the random quote to the quotes array', () => {
      component.addRandomQuote();
      http.expectOne(environment.RANDOM_QUOTE_URL).flush(testQuote);
      expect(component.quotes).toEqual([
        {
          id: 1,
          text: 'QUOTE',
          savedAsGreatThing: false
        }
      ]);
    });

    it('should create a new GreatThing with the random quote', () => {
      component.addRandomQuote();
      http.expectOne(environment.RANDOM_QUOTE_URL).flush(testQuote);
      expect(greatThings.create).toHaveBeenCalledWith(testQuote.quote);
    });

    it('should mark the quote.savedAsGreatThing as true when all calls succeed', () => {
      component.addRandomQuote();
      http.expectOne(environment.RANDOM_QUOTE_URL).flush(testQuote);
      greatThings.create.observer.next({});
      expect(component.quotes).toEqual([
        {
          id: 1,
          text: 'QUOTE',
          savedAsGreatThing: true
        }
      ]);
    });
  });
});
