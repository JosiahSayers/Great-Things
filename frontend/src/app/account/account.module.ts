import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { componentDeclarations, providerDeclarations } from './account.common';
import { AccountRoutingModule } from './account-routing.module';



@NgModule({
  declarations: [
    ...componentDeclarations
  ],
  imports: [
    CommonModule,
    AccountRoutingModule
  ],
  providers: [
    ...providerDeclarations
  ]
})
export class AccountModule { }
