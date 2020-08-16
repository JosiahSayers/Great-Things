import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationBaseComponent } from './authentication-base/authentication-base.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthenticationBaseComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  }
];
