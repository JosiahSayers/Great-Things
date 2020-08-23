import { Routes } from '@angular/router';
import { GreatThingsBaseComponent } from './great-things-base/great-things-base.component';
import { GreatThingComponent } from './great-thing/great-thing.component';
import { GreatThingsGuard } from './great-things-base/great-things.guard';

export const componentDeclarations: any[] = [
  GreatThingsBaseComponent,
  GreatThingComponent
];

export const providerDeclarations: any[] = [
  GreatThingsGuard
];

export const routes: Routes = [
];
