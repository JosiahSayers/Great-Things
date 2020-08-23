import { Routes } from '@angular/router';

import { GreatThingsBaseComponent } from './great-things-base/great-things-base.component';
import { GreatThingsGuard } from './great-things-base/great-things.guard';

export const routes: Routes = [
  {
    path: '',
    component: GreatThingsBaseComponent,
    canActivate: [GreatThingsGuard]
  }
];
