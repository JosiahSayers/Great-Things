import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedServicesModule } from '../shared/services/shared-services.module';
import { GreatThingsRoutingModule } from './great-things-routing.module';
import { componentDeclarations } from './great-things.common';

@NgModule({
  declarations: [
    ...componentDeclarations
  ],
  imports: [
    CommonModule,
    SharedServicesModule,
    GreatThingsRoutingModule
  ]
})
export class GreatThingsModule { }
