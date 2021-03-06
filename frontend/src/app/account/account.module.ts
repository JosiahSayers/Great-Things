import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { componentDeclarations, providerDeclarations } from '@src/app/account/account.common';
import { AccountRoutingModule } from '@src/app/account/account-routing.module';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module';
import { ComponentsModule } from '@src/app/shared/components/components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileSaverService } from '@src/app/account/shared/services/file-saver.service';

@NgModule({
  declarations: [
    ...componentDeclarations
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedServicesModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  providers: [
    ...providerDeclarations,
    FileSaverService
  ]
})
export class AccountModule { }
