import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassFailListItemComponent } from '@src/app/components/pass-fail-list-item/pass-fail-list-item.component';

describe('PassFailListItemComponent', () => {
  let component: PassFailListItemComponent;
  let fixture: ComponentFixture<PassFailListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassFailListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassFailListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
