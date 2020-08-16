import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuildersService } from '../shared/forms/form-builders.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuildersService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.registerForm();
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      console.log('SUBMITTED FORM IS VALID');
    }
  }

}
