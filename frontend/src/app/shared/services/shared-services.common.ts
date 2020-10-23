import { Routes } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GreatThingsService } from './great-things/great-things.service';
import { FormBuildersService } from './forms/form-builders.service';
import { ImageUploadService } from './image-upload/image-upload.service';

export const componentDeclarations: any[] = [
];

export const providerDeclarations: any[] = [
  AuthService,
  GreatThingsService,
  {
    provide: JwtHelperService,
    useFactory: () => new JwtHelperService()
  },
  FormBuildersService,
  ImageUploadService
];

export const routes: Routes = [
];
