import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { SharedServicesModule } from '../shared/services/shared-services.module.tns';
import { AccountRoutingModule } from './account-routing.module.tns';
import { componentDeclarations, providerDeclarations } from './account.common';



@NgModule({
  declarations: [
    ...componentDeclarations
  ],
  imports: [
    NativeScriptCommonModule,
    AccountRoutingModule,
    SharedServicesModule
  ],
  providers: [
    ...providerDeclarations
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AccountModule { }
