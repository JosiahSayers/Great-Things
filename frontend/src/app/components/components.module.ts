import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '@src/app/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { PassFailListItemComponent } from '@src/app/components/pass-fail-list-item/pass-fail-list-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    NavbarComponent,
    PassFailListItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    NavbarComponent,
    PassFailListItemComponent
  ]
})
export class ComponentsModule { }
