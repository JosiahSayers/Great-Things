import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreatThingsBaseComponent } from '@src/app/great-things/great-things-base/great-things-base.component';

describe('GreatThingsBaseComponent', () => {
  let component: GreatThingsBaseComponent;
  let fixture: ComponentFixture<GreatThingsBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreatThingsBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreatThingsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
