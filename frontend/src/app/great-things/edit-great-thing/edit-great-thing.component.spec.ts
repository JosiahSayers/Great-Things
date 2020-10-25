import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGreatThingComponent } from '@src/app/great-things/edit-great-thing/edit-great-thing.component';

describe('EditGreatThingComponent', () => {
  let component: EditGreatThingComponent;
  let fixture: ComponentFixture<EditGreatThingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGreatThingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGreatThingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
