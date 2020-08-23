import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { GreatThingsBaseComponent } from '@src/app/great-things/great-things-base/great-things-base.component';
import { SharedServicesModule } from '../shared/services/shared-services.module.tns';
import { GreatThingsRoutingModule } from './great-things-routing.module.tns';
import { componentDeclarations } from './great-things.common';

@NgModule({
  declarations: [
    ...componentDeclarations
  ],
  imports: [
    NativeScriptCommonModule,
    SharedServicesModule,
    GreatThingsRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class GreatThingsModule { }
