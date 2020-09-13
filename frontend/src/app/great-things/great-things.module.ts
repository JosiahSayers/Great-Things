import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module';
import { GreatThingsRoutingModule } from '@src/app/great-things/great-things-routing.module';
import { componentDeclarations, providerDeclarations } from '@src/app/great-things/great-things.common';
import { GreatThingsTilesComponent } from '@src/app/great-things/great-things-tiles/great-things-tiles.component';

@NgModule({
  declarations: [
    ...componentDeclarations,
    GreatThingsTilesComponent
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
