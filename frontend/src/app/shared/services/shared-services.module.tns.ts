import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { providerDeclarations } from './shared-services.common';



@NgModule({
  declarations: [],
  imports: [
    NativeScriptCommonModule,
    NativeScriptHttpClientModule
  ],
  providers: [
    ...providerDeclarations
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedServicesModule { }
