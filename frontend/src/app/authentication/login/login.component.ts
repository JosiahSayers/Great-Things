import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuildersService } from '../shared/forms/form-builders.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuildersService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.loginForm();
  }

  onFormSubmit(): void {
    if (this.form.valid) {
      console.log('SUBMITTED FORM IS VALID');
    }
  }

}
