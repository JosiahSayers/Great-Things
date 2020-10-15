import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPersonalDataComponent } from '@src/app/account/download-personal-data/download-personal-data.component';

describe('DownloadPersonalDataComponent', () => {
  let component: DownloadPersonalDataComponent;
  let fixture: ComponentFixture<DownloadPersonalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadPersonalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
