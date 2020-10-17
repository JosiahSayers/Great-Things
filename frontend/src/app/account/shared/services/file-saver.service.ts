import { Injectable } from '@angular/core';
import { FileSaverOptions, saveAs } from 'file-saver';

@Injectable()
export class FileSaverService {

  saveAs: (data: Blob | string, filename?: string, options?: FileSaverOptions) => void;

  constructor() {
    this.saveAs = saveAs;
  }
}
