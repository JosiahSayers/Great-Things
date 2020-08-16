import { Routes } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

export const componentDeclarations: any[] = [
];

export const providerDeclarations: any[] = [
  AuthService,
  {
    provide: JwtHelperService,
    useFactory: () => new JwtHelperService()
  }
];

export const routes: Routes = [
];
