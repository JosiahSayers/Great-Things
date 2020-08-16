import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationBaseComponent } from '@src/app/authentication/authentication-base/authentication-base.component';
import { LoginComponent } from '@src/app/authentication/login/login.component';
import { RegisterComponent } from '@src/app/authentication/register/register.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [AuthenticationBaseComponent, LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    RouterModule
  ]
})
export class AuthenticationModule { }
