import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module.tns';
import { AccountRoutingModule } from '@src/app/account/account-routing.module.tns';
import { componentDeclarations, providerDeclarations } from '@src/app/account/account.common';

@NgModule({
  declarations: [
    ...componentDeclarations,
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
