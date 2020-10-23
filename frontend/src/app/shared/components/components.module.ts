import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '@src/app/shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { PassFailListItemComponent } from '@src/app/shared/components/pass-fail-list-item/pass-fail-list-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ErrorNotificationComponent } from '@src/app/shared/components/error-notification/error-notification.component';
import { NavbarUserInfoComponent } from '@src/app/shared/components/navbar/navbar-user-info/navbar-user-info.component';
import { PasswordCheckComponent } from '@src/app/shared/components/password-check/password-check.component';
import { FileUploadComponent } from '@src/app/shared/components/file-upload/file-upload.component';

@NgModule({
  declarations: [
    NavbarComponent,
    PassFailListItemComponent,
    ErrorNotificationComponent,
    NavbarUserInfoComponent,
    PasswordCheckComponent,
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    NavbarComponent,
    PassFailListItemComponent,
    ErrorNotificationComponent,
    PasswordCheckComponent,
    FileUploadComponent
  ]
})
export class ComponentsModule { }
