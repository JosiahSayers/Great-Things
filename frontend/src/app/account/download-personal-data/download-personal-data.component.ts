import { Component } from '@angular/core';
import { AccountService } from '../shared/services/account.service';

@Component({
  selector: 'app-download-personal-data',
  templateUrl: './download-personal-data.component.html',
  styleUrls: ['./download-personal-data.component.scss']
})
export class DownloadPersonalDataComponent {

  isLoading = false;
  errorNotificationState = 'hidden';

  constructor(
    private accountService: AccountService
  ) { }

  startDownload(): void {
    this.isLoading = true;
    this.errorNotificationState = 'hidden';
    this.accountService.downloadAllData().subscribe({
      next: () => this.isLoading = false,
      error: () => { this.isLoading = false; this.errorNotificationState = 'shown'; }
    });
  }

}
