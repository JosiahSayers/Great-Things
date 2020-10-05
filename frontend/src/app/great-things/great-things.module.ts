import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module';
import { GreatThingsRoutingModule } from '@src/app/great-things/great-things-routing.module';
import { componentDeclarations, exports, providerDeclarations } from '@src/app/great-things/great-things.common';

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
  ],
  exports: [
    ...exports
  ]
})
export class GreatThingsModule { }
