import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationBaseComponent } from '@src/app/authentication/authentication-base/authentication-base.component';
import { LoginComponent } from '@src/app/authentication/login/login.component';
import { RegisterComponent } from '@src/app/authentication/register/register.component';
import { AuthenticationRoutingModule } from '@src/app/authentication/authentication-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { providerDeclarations } from '@src/app/authentication/authentication.common';
import { ComponentsModule } from '../shared/components/components.module';



@NgModule({
  declarations: [
    AuthenticationBaseComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  providers: [
    ...providerDeclarations
  ]
})
export class AuthenticationModule { }
