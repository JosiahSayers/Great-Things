import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '@src/app/shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { PassFailListItemComponent } from '@src/app/shared/components/pass-fail-list-item/pass-fail-list-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ErrorNotificationComponent } from '@src/app/shared/components/error-notification/error-notification.component';

@NgModule({
  declarations: [
    NavbarComponent,
    PassFailListItemComponent,
    ErrorNotificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    NavbarComponent,
    PassFailListItemComponent,
    ErrorNotificationComponent
  ]
})
export class ComponentsModule { }
