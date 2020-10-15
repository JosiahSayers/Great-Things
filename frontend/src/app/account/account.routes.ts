import { Routes } from '@angular/router';
import { ChangeNameComponent } from './change-name/change-name.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeProfilePictureComponent } from './change-profile-picture/change-profile-picture.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { DownloadPersonalDataComponent } from './download-personal-data/download-personal-data.component';
import { MainComponent } from './main/main.component';
import { OverviewComponent } from './overview/overview.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
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
      }
    ]
  }
];
