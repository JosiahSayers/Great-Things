import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AuthenticationBaseComponent } from '@src/app/authentication/authentication-base/authentication-base.component';
import { LoginComponent } from '@src/app/authentication/login/login.component';
import { RegisterComponent } from '@src/app/authentication/register/register.component';
import { AuthenticationRoutingModule } from './authentication-routing.module.tns';



@NgModule({
  declarations: [AuthenticationBaseComponent, LoginComponent, RegisterComponent],
  imports: [
    NativeScriptCommonModule,
    AuthenticationRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AuthenticationModule { }
