import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GreatThingsBaseComponent } from '@src/app/great-things/great-things-base/great-things-base.component';
import { GreatThingsService } from '../../shared/services/great-things/great-things.service';
import { spyOnClass } from '../../utils/testing/helper-functions';
import { Spied } from '../../utils/testing/spied.interface';

describe('GreatThingsBaseComponent', () => {
  let component: GreatThingsBaseComponent;
  let fixture: ComponentFixture<GreatThingsBaseComponent>;
  let greatThingsService: Spied<GreatThingsService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GreatThingsBaseComponent],
      providers: [
        {
          provide: GreatThingsService,
          useFactory: () => greatThingsService = spyOnClass(GreatThingsService, ['retrieve'])
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
});
