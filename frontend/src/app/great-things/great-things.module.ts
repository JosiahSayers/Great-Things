import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedServicesModule } from '../shared/services/shared-services.module';
import { GreatThingsRoutingModule } from './great-things-routing.module';
import { componentDeclarations, providerDeclarations } from './great-things.common';

@NgModule({
  declarations: [
    ...componentDeclarations
  ],
  imports: [
    CommonModule,
    SharedServicesModule,
    GreatThingsRoutingModule
  ],
  providers: [
    ...providerDeclarations
  ]
})
export class GreatThingsModule { }
