import { Routes } from '@angular/router';
import { ChangeNameComponent } from '@src/app/account/change-name/change-name.component';
import { ChangePasswordComponent } from '@src/app/account/change-password/change-password.component';
import { ChangeProfilePictureComponent } from '@src/app/account/change-profile-picture/change-profile-picture.component';
import { DeleteAccountComponent } from '@src/app/account/delete-account/delete-account.component';
import { DownloadPersonalDataComponent } from '@src/app/account/download-personal-data/download-personal-data.component';
import { MainComponent } from '@src/app/account/main/main.component';
import { OverviewComponent } from '@src/app/account/overview/overview.component';
import { AccountGuard } from './shared/guards/account.guard';
import { TestingComponent } from './testing/testing.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AccountGuard],
    children: [
      {
        path: '',
        component: OverviewComponent
      },
      {
        path: 'change-profile-picture',
        component: ChangeProfilePictureComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'change-name',
        component: ChangeNameComponent
      },
      {
        path: 'download-personal-data',
        component: DownloadPersonalDataComponent
      },
      {
        path: 'delete-account',
        component: DeleteAccountComponent
      },
      {
        path: 'testing',
        component: TestingComponent
      }
    ]
  }
];
