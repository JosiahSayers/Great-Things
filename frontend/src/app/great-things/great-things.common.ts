import { Routes } from '@angular/router';
import { GreatThingsBaseComponent } from '@src/app/great-things/great-things-base/great-things-base.component';
import { GreatThingComponent } from '@src/app/great-things/great-thing/great-thing.component';
import { GreatThingsGuard } from '@src/app/great-things/great-things-base/great-things.guard';

export const componentDeclarations: any[] = [
  GreatThingsBaseComponent,
  GreatThingComponent
];

export const providerDeclarations: any[] = [
  GreatThingsGuard
];

export const routes: Routes = [
];

export const exports: any[] = [
  GreatThingsBaseComponent,
  GreatThingComponent
];
