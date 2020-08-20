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
});
