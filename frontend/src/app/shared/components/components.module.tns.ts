import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { PassFailListItemComponent } from '@src/app/shared/components/pass-fail-list-item/pass-fail-list-item.component';



@NgModule({
  declarations: [PassFailListItemComponent],
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule
  ],
  exports: [
    PassFailListItemComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ComponentsModule { }
