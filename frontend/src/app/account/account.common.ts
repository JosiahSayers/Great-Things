import { Routes } from '@angular/router';
import { ChangeNameComponent } from './change-name/change-name.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeProfilePictureComponent } from './change-profile-picture/change-profile-picture.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { DownloadPersonalDataComponent } from './download-personal-data/download-personal-data.component';
import { MainComponent } from './main/main.component';
import { OverviewComponent } from './overview/overview.component';

export const componentDeclarations: any[] = [
  MainComponent,
  ChangeNameComponent,
  ChangePasswordComponent,
  ChangeProfilePictureComponent,
  DeleteAccountComponent,
  DownloadPersonalDataComponent,
  OverviewComponent
];

export const providerDeclarations: any[] = [
];

export const routes: Routes = [
];
