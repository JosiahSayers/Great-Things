import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './account.routes';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
