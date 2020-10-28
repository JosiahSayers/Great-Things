import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalComponent } from '@src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { spyOnClass } from '@src/app/utils/testing/helper-functions';
import { Spied } from '@src/app/utils/testing/spied.interface';
import { ModalService } from '../../services/modal/modal.service';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let modalService: Spied<ModalService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationModalComponent],
      providers: [
        {
          provide: ModalService,
          useFactory: () => modalService = spyOnClass(ModalService, [
            'confirmationModalOpen'
          ])
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => modalService.cleanupObservables());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('subscribes to confirmationModalOpen onInit', () => {
    expect(modalService.confirmationModalOpen.observers.length).toBe(1);
  });

  it('sets isActive to the value coming in from the confirmationModalOpen subscription', () => {
    component.isActive = false;
    modalService.confirmationModalOpen.observer.next(true);
    expect(component.isActive).toBeTrue();
  });

  describe('sendChoice', () => {
    it('sends the argument value to sendConfirmationModalChoice', () => {
      component.sendChoice('cancel');
      expect(modalService.sendConfirmationModalChoice).toHaveBeenCalledWith('cancel');
    });
  });
});
