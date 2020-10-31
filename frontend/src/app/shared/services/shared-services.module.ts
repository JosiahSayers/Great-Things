import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { providerDeclarations } from './shared-services.common';
import { StorageService } from './storage/storage.service';
import { WebStorageService } from './storage/web-storage.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ...providerDeclarations,
    {
      provide: 'window',
      useValue: window
    },
    {
      provide: StorageService,
      useClass: WebStorageService
    }
  ]
})
export class SharedServicesModule { }
