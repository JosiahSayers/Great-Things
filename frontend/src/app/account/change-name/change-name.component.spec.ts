import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeNameComponent } from '@src/app/account/change-name/change-name.component';

describe('ChangeNameComponent', () => {
  let component: ChangeNameComponent;
  let fixture: ComponentFixture<ChangeNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
