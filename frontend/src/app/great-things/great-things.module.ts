import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module';
import { GreatThingsRoutingModule } from '@src/app/great-things/great-things-routing.module';
import { componentDeclarations, exports, providerDeclarations } from '@src/app/great-things/great-things.common';
import { EditGreatThingComponent } from '@src/app/great-things/edit-great-thing/edit-great-thing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@src/app/shared/components/components.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CreateGreatThingComponent } from '@src/app/great-things/create-great-thing/create-great-thing.component';

@NgModule({
  declarations: [
    ...componentDeclarations,
    EditGreatThingComponent,
    CreateGreatThingComponent
  ],
  imports: [
    CommonModule,
    SharedServicesModule,
    GreatThingsRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    InfiniteScrollModule
  ],
  providers: [
    ...providerDeclarations
  ],
  exports: [
    ...exports
  ]
})
export class GreatThingsModule { }
