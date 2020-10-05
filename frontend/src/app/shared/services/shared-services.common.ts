import { Routes } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GreatThingsService } from './great-things/great-things.service';
import { LoggerService } from './logger/logger.service';

export const componentDeclarations: any[] = [
];

export const providerDeclarations: any[] = [
  AuthService,
  GreatThingsService,
  {
    provide: JwtHelperService,
    useFactory: () => new JwtHelperService()
  },
  LoggerService
];

export const routes: Routes = [
];
