import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreatThingsTilesComponent } from '@src/app/great-things/great-things-tiles/great-things-tiles.component';

describe('GreatThingsTilesComponent', () => {
  let component: GreatThingsTilesComponent;
  let fixture: ComponentFixture<GreatThingsTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreatThingsTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreatThingsTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
