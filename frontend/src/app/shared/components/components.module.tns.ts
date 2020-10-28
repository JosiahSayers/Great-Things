import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { PassFailListItemComponent } from '@src/app/shared/components/pass-fail-list-item/pass-fail-list-item.component';
import { ErrorNotificationComponent } from '@src/app/shared/components/error-notification/error-notification.component';
import { GreatThingComponent } from '@src/app/great-things/great-thing/great-thing.component';
import { NavbarUserInfoComponent } from '@src/app/shared/components/navbar/navbar-user-info/navbar-user-info.component';
import { PasswordCheckComponent } from '@src/app/shared/components/password-check/password-check.component';
import { FileUploadComponent } from '@src/app/shared/components/file-upload/file-upload.component';
import { ConfirmationModalComponent } from '@src/app/shared/components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    PassFailListItemComponent,
    ErrorNotificationComponent,
    GreatThingComponent,
    NavbarUserInfoComponent,
    PasswordCheckComponent,
    FileUploadComponent,
    ConfirmationModalComponent
  ],
  imports: [
    NativeScriptCommonModule,
    NativeScriptRouterModule
  ],
  exports: [
    PassFailListItemComponent,
    PasswordCheckComponent,
    FileUploadComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ComponentsModule { }
