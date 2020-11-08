import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGreatThingComponent } from '@src/app/great-things/create-great-thing/create-great-thing.component';

describe('CreateGreatThingComponent', () => {
  let component: CreateGreatThingComponent;
  let fixture: ComponentFixture<CreateGreatThingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGreatThingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGreatThingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
