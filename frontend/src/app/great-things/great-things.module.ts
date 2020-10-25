import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module';
import { GreatThingsRoutingModule } from '@src/app/great-things/great-things-routing.module';
import { componentDeclarations, exports, providerDeclarations } from '@src/app/great-things/great-things.common';
import { EditGreatThingComponent } from '@src/app/great-things/edit-great-thing/edit-great-thing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../shared/components/components.module';

@NgModule({
  declarations: [
    ...componentDeclarations,
    EditGreatThingComponent
  ],
  imports: [
    CommonModule,
    SharedServicesModule,
    GreatThingsRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  providers: [
    ...providerDeclarations
  ],
  exports: [
    ...exports
  ]
})
export class GreatThingsModule { }
