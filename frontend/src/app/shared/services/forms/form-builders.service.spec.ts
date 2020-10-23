import { TestBed } from '@angular/core/testing';
import { FormBuildersService } from './form-builders.service';

describe('FormBuildersService', () => {
  let service: FormBuildersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuildersService]
    });
    service = TestBed.inject(FormBuildersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerForm', () => {
    it('has the required controls', () => {
      const registerForm = service.registerForm();
      expect(registerForm.controls.name).toBeDefined();
      expect(registerForm.controls.email).toBeDefined();
      expect(registerForm.controls.password).toBeDefined();
    });
  });

  describe('loginForm', () => {
    it('has the required controls', () => {
      const registerForm = service.loginForm();
      expect(registerForm.controls.email).toBeDefined();
      expect(registerForm.controls.password).toBeDefined();
    });
  });

  describe('changeNameForm', () => {
    it('has the required controls', () => {
      const form = service.changeNameForm('CURRENT NAME');
      expect(form.controls.name).toBeDefined();
      expect(form.controls.name.value).toBe('CURRENT NAME');
    });
  });

  describe('changePasswordForm', () => {
    it('has the required controls', () => {
      const form = service.changePasswordForm();
      expect(form.controls.currentPassword).toBeDefined();
      expect(form.controls.newPassword).toBeDefined();
    });
  });

  describe('uploadImageForm', () => {
    it('has the required controls', () => {
      const form = service.uploadImageForm();
      expect(form.controls.image).toBeDefined();
    });
  });
});
