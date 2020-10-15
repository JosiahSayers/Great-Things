import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AccountRoutingModule } from './account-routing.module.tns';
import { componentDeclarations, providerDeclarations } from './account.common';



@NgModule({
  declarations: [
    ...componentDeclarations
  ],
  imports: [
    NativeScriptCommonModule,
    AccountRoutingModule
  ],
  providers: [
    ...providerDeclarations
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AccountModule { }
