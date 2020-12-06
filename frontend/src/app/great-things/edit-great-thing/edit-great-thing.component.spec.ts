import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { EditGreatThingComponent } from '@src/app/great-things/edit-great-thing/edit-great-thing.component';
import { ErrorNotificationComponent } from '@src/app/shared/components/error-notification/error-notification.component';
import { GreatThing } from '@src/app/shared/models/GreatThing.model';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { GreatThingsService } from '@src/app/shared/services/great-things/great-things.service';
import { ModalService } from '@src/app/shared/services/modal/modal.service';
import { spyOnClass } from '@src/app/utils/testing/helper-functions';
import { Spied } from '@src/app/utils/testing/spied.interface';
import { MockComponent } from 'ng-mocks';
import { Subscription } from 'rxjs';
import { GreatThingsCacheService } from '../shared/services/great-things-cache/great-things-cache.service';

describe('EditGreatThingComponent', () => {
  let component: EditGreatThingComponent;
  let fixture: ComponentFixture<EditGreatThingComponent>;
  let formBuilder: Spied<FormBuildersService>;
  let cache: Spied<GreatThingsCacheService>;
  let greatThingsService: Spied<GreatThingsService>;
  let modalService: Spied<ModalService>;
  let testSub: Subscription;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        EditGreatThingComponent,
        MockComponent(ErrorNotificationComponent)
      ],
      providers: [
        {
          provide: FormBuildersService,
          useFactory: () => formBuilder = spyOnClass(FormBuildersService)
        },
        {
          provide: GreatThingsCacheService,
          useFactory: () => cache = spyOnClass(GreatThingsCacheService)
        },
        {
          provide: GreatThingsService,
          useFactory: () => greatThingsService = spyOnClass(GreatThingsService, [
            'remove',
            'edit'
          ])
        },
        {
          provide: ModalService,
          useFactory: () => modalService = spyOnClass(ModalService, [
            'openAreYouSureModal'
          ])
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGreatThingComponent);
    component = fixture.componentInstance;
    component.greatThing = new GreatThing('ID', 'TEXT', '1', '1');
    _stubFormGroup();
    fixture.detectChanges();
  });

  afterEach(() => {
    testSub?.unsubscribe();
    modalService.cleanupObservables();
    greatThingsService.cleanupObservables();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emitToggleEditing', () => {
    it('emits an event for it\'s parent when called', (done) => {
      testSub = component.toggleEditing.subscribe(() => {
        expect(true).toBeTrue();
        done();
      });
      component.emitToggleEditing();
    });
  });

  describe('confirmDelete', () => {
    function getToApiCall() {
      component.confirmDelete();
      modalService.openAreYouSureModal.observer.next('confirm');
    }

    it('uses the modal service to open a confrimation modal and subscribes to the user\'s choice', () => {
      component.confirmDelete();
      expect(modalService.openAreYouSureModal).toHaveBeenCalledWith();
      expect(modalService.openAreYouSureModal.observers.length).toBe(1);
    });

    it('calls deletes the current great thing if it receives a confirmation', () => {
      getToApiCall();
      expect(component.errorNotificationState).toBe('hidden');
      expect(greatThingsService.remove).toHaveBeenCalledWith('ID');
    });

    it('removes the great thing from cache and emits an editing toggle when the API call succeeds', (done) => {
      component.toggleEditing.subscribe(() => {
        expect(true).toBeTrue();
        done();
      });
      getToApiCall();
      greatThingsService.remove.observer.next({});
      expect(cache.removeGreatThing).toHaveBeenCalledWith('ID');
    });

    it('displays an error notification when the API call fails', () => {
      getToApiCall();
      greatThingsService.remove.observer.error({});
      expect(component.errorNotificationState).toBe('shown');
    });
  });

  describe('sendUpdateApiRequest', () => {
    beforeEach(() => spyOnProperty(component.form, 'valid').and.returnValue(true));

    it('hides the error notification and calls the edit on greatThingsService with the expected arguments when the form is valid', () => {
      component.form.controls.text.setValue('NEW TEXT VALUE');
      component.sendUpdateApiRequest();
      expect(component.errorNotificationState).toBe('hidden');
      expect(greatThingsService.edit).toHaveBeenCalledWith({
        id: 'ID',
        text: 'NEW TEXT VALUE'
      });
    });

    it('updates the cache and emits a toggle editing event when the API call succeeds', (done) => {
      component.toggleEditing.subscribe(() => {
        expect(true).toBe(true);
        done();
      });
      const testResponse = { prop: 'VALUE' };
      component.sendUpdateApiRequest();
      greatThingsService.edit.observer.next(testResponse);
      expect(cache.updateGreatThing).toHaveBeenCalledWith(testResponse);
    });

    it('displays an error notification when the API call fails', () => {
      component.sendUpdateApiRequest();
      greatThingsService.edit.observer.error({});
      expect(component.errorNotificationState).toBe('shown');
    });
  });

  function _stubFormGroup(): void {
    formBuilder.greatThing.and.returnValue(new FormGroup({
      text: new FormControl('TEXT')
    }));
  }
});
