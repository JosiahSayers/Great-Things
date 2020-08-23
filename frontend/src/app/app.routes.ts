import { Routes } from '@angular/router';

import { HomeComponent } from '@src/app/home/home.component';
import { HomeGuard } from './home/home.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [HomeGuard]
  },
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'great-things',
    loadChildren: () => import('./great-things/great-things.module').then(m => m.GreatThingsModule)
  }
];
