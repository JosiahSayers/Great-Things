import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GreatThingsBaseComponent } from '@src/app/great-things/great-things-base/great-things-base.component';
import { MockComponent } from 'ng-mocks';
import { GreatThingsService } from '../../shared/services/great-things/great-things.service';
import { spyOnClass } from '../../utils/testing/helper-functions';
import { Spied } from '../../utils/testing/spied.interface';
import { CreateGreatThingComponent } from '../create-great-thing/create-great-thing.component';
import { GreatThingsCacheService } from '../shared/services/great-things-cache/great-things-cache.service';

describe('GreatThingsBaseComponent', () => {
  let component: GreatThingsBaseComponent;
  let fixture: ComponentFixture<GreatThingsBaseComponent>;
  let greatThingsService: Spied<GreatThingsService>;
  let cache: Spied<GreatThingsCacheService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GreatThingsBaseComponent,
        MockComponent(CreateGreatThingComponent)
      ],
      providers: [
        {
          provide: GreatThingsService,
          useFactory: () => greatThingsService = spyOnClass(GreatThingsService, ['retrieve'])
        },
        {
          provide: GreatThingsCacheService,
          useFactory: () => cache = spyOnClass(GreatThingsCacheService)
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreatThingsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    greatThingsService.cleanupObservables();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls the retrieve function of the great things service', () => {
    expect(greatThingsService.retrieve).toHaveBeenCalled();
  });

  it('passes the response of the API call to the cache and sets loading to false when the API call suceeds', () => {
    greatThingsService.retrieve.observer.next(['TEST']);
    expect(cache.addGreatThings).toHaveBeenCalledWith(['TEST']);
    expect(component.loading).toBeFalse();
  });

  describe('greatThings', () => {
    it('returns the value of greatThings on the cache', () => {
      cache.setProperty('greatThings', ['TEST']);
      expect(component.greatThings).toEqual(<any>['TEST']);
    });
  });
});
