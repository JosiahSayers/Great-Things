import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { componentDeclarations, providerDeclarations } from './account.common';
import { AccountRoutingModule } from './account-routing.module';
import { SharedServicesModule } from '../shared/services/shared-services.module';



@NgModule({
  declarations: [
    ...componentDeclarations
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
