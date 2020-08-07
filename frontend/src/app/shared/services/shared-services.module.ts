import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { providerDeclarations } from './shared-services.common';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ...providerDeclarations
  ]
})
export class SharedServicesModule { }
