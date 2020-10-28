import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GreatThingComponent } from '@src/app/great-things/great-thing/great-thing.component';
import { GreatThing } from '../../shared/models/GreatThing.model';

describe('GreatThingComponent', () => {
  let component: GreatThingComponent;
  let fixture: ComponentFixture<GreatThingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GreatThingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreatThingComponent);
    component = fixture.componentInstance;
    component.greatThing = new GreatThing('ID', 'TEXT', '1', '1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleEditing', () => {
    it('flips the boolean value of editing', () => {
      component.editing = false;
      component.toggleEditing();
      expect(component.editing).toBeTrue();
    });
  });
});
