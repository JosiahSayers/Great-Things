import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateGreatThingComponent } from '@src/app/great-things/create-great-thing/create-great-thing.component';
import { ErrorNotificationComponent } from '@src/app/shared/components/error-notification/error-notification.component';
import { FormBuildersService } from '@src/app/shared/services/forms/form-builders.service';
import { GreatThingsService } from '@src/app/shared/services/great-things/great-things.service';
import { spyOnClass } from '@src/app/utils/testing/helper-functions';
import { Spied } from '@src/app/utils/testing/spied.interface';
import { MockComponent } from 'ng-mocks';

describe('CreateGreatThingComponent', () => {
  let component: CreateGreatThingComponent;
  let fixture: ComponentFixture<CreateGreatThingComponent>;
  let formBuilder: Spied<FormBuildersService>;
  let greatThings: Spied<GreatThingsService>;

  const testForm = new FormGroup({
    text: new FormControl('')
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        CreateGreatThingComponent,
        MockComponent(ErrorNotificationComponent)
      ],
      providers: [
        {
          provide: FormBuildersService,
          useFactory: () => formBuilder = spyOnClass(FormBuildersService)
        },
        {
          provide: GreatThingsService,
          useFactory: () => greatThings = spyOnClass(GreatThingsService, [
            'create'
          ])
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGreatThingComponent);
    component = fixture.componentInstance;
    formBuilder.greatThing.and.returnValue(testForm);
    fixture.detectChanges();
  });

  afterEach(() => greatThings.cleanupObservables());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates the form on init', () => {
    expect(formBuilder.greatThing).toHaveBeenCalledTimes(1);
    expect(component.form).toBe(testForm);
  });

  describe('onSubmitClick', () => {
    describe('when the form is valid', () => {
      it('sets errorNotificationState to "hidden"', () => {
        component.errorNotificationState = 'shown';
        component.onSubmitClick();
        expect(component.errorNotificationState).toBe('hidden');
      });

      it('sets isLoading to true', () => {
        component.isLoading = false;
        component.onSubmitClick();
        expect(component.isLoading).toBeTrue();
      });

      it('calls create on the great things service with the value of the text box', () => {
        component.form.controls.text.setValue('TEXT VALUE');
        component.onSubmitClick();
        expect(greatThings.create).toHaveBeenCalledWith('TEXT VALUE');
      });

      describe('when the call is successful', () => {
        it('resets the form', () => {
          const resetSpy = spyOn(component.form, 'reset');
          component.onSubmitClick();
          greatThings.create.observer.next({});
          expect(resetSpy).toHaveBeenCalledTimes(1);
        });

        it('sets isLoading to false', () => {
          component.onSubmitClick();
          expect(component.isLoading).toBeTrue();
          greatThings.create.observer.next({});
          expect(component.isLoading).toBeFalse();
        });
      });

      describe('when the call fails', () => {
        it('sets isLoading to false', () => {
          component.onSubmitClick();
          expect(component.isLoading).toBeTrue();
          greatThings.create.observer.error({});
          expect(component.isLoading).toBeFalse();
        });

        it('sets errorNotificationState to "shown"', () => {
          component.onSubmitClick();
          expect(component.errorNotificationState).toBe('hidden');
          greatThings.create.observer.error({});
          expect(component.errorNotificationState).toBe('shown');
        });
      });
    });
  });

  describe('shouldDisableSubmit', () => {
    it('returns true if the form is invalid', () => {
      component.form.setErrors({ anyError: true });
      expect(component.form.valid).toBeFalse();
      expect(component.shouldDisableSubmit).toBeTrue();
    });

    it('returns false if the form is valid', () => {
      expect(component.form.valid).toBeTrue();
      expect(component.shouldDisableSubmit).toBeFalse();
    });
  });
});
