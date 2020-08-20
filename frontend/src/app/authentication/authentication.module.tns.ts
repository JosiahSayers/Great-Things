import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { AuthenticationBaseComponent } from '@src/app/authentication/authentication-base/authentication-base.component';
import { LoginComponent } from '@src/app/authentication/login/login.component';
import { RegisterComponent } from '@src/app/authentication/register/register.component';
import { AuthenticationRoutingModule } from '@src/app/authentication/authentication-routing.module.tns';
import { ReactiveFormsModule } from '@angular/forms';
import { providerDeclarations } from '@src/app/authentication/authentication.common';
import { PasswordCheckComponent } from '@src/app/authentication/shared/components/password-check/password-check.component';



@NgModule({
  declarations: [AuthenticationBaseComponent, LoginComponent, RegisterComponent, PasswordCheckComponent],
  imports: [
    NativeScriptCommonModule,
    AuthenticationRoutingModule,
    NativeScriptRouterModule,
    ReactiveFormsModule
  ],
  providers: [
    ...providerDeclarations
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AuthenticationModule { }
