import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { componentDeclarations, providerDeclarations } from '@src/app/account/account.common';
import { AccountRoutingModule } from '@src/app/account/account-routing.module';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module';

@NgModule({
  declarations: [
    ...componentDeclarations,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedServicesModule
  ],
  providers: [
    ...providerDeclarations
  ]
})
export class AccountModule { }
