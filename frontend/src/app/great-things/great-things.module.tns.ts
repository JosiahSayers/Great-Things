import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module.tns';
import { GreatThingsRoutingModule } from '@src/app/great-things/great-things-routing.module.tns';
import { componentDeclarations } from '@src/app/great-things/great-things.common';
import { GreatThingsTilesComponent } from '@src/app/great-things/great-things-tiles/great-things-tiles.component';
import { GreatThingsBaseComponent } from '@src/app/great-things/great-things-base/great-things-base.component';
import { EditGreatThingComponent } from '@src/app/great-things/edit-great-thing/edit-great-thing.component';

@NgModule({
  declarations: [
    ...componentDeclarations,
    GreatThingsTilesComponent,
    EditGreatThingComponent
  ],
  imports: [
    NativeScriptCommonModule,
    SharedServicesModule,
    GreatThingsRoutingModule
  ],
  exports: [
    GreatThingsBaseComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GreatThingsModule { }
