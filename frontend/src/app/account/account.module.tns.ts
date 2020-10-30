import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module.tns';
import { AccountRoutingModule } from '@src/app/account/account-routing.module.tns';
import { componentDeclarations, providerDeclarations } from '@src/app/account/account.common';
import { ComponentsModule } from '@src/app/shared/components/components.module.tns';
import { ReactiveFormsModule } from '@angular/forms';
import { TestingComponent } from '@src/app/account/testing/testing.component';

@NgModule({
  declarations: [
    ...componentDeclarations,
    TestingComponent,
  ],
  imports: [
    NativeScriptCommonModule,
    AccountRoutingModule,
    SharedServicesModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  providers: [
    ...providerDeclarations
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AccountModule { }
