import { Routes } from '@angular/router';
import { ChangeNameComponent } from '@src/app/account/change-name/change-name.component';
import { ChangePasswordComponent } from '@src/app/account/change-password/change-password.component';
import { ChangeProfilePictureComponent } from '@src/app/account/change-profile-picture/change-profile-picture.component';
import { DeleteAccountComponent } from '@src/app/account/delete-account/delete-account.component';
import { DownloadPersonalDataComponent } from '@src/app/account/download-personal-data/download-personal-data.component';
import { MainComponent } from '@src/app/account/main/main.component';
import { OverviewComponent } from '@src/app/account/overview/overview.component';
import { AccountService } from '@src/app/account/shared/services/account.service';
import { TestingComponent } from './testing/testing.component';

export const componentDeclarations: any[] = [
  MainComponent,
  ChangeNameComponent,
  ChangePasswordComponent,
  ChangeProfilePictureComponent,
  DeleteAccountComponent,
  DownloadPersonalDataComponent,
  OverviewComponent,
  TestingComponent
];

export const providerDeclarations: any[] = [
  AccountService
];

export const routes: Routes = [
];
