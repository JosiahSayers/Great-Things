import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreatThingComponent } from '@src/app/great-things/great-thing/great-thing.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
