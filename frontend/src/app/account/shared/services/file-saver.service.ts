import { Injectable } from '@angular/core';
import { FileSaverOptions, saveAs as saveFile } from 'file-saver';

@Injectable()
export class FileSaverService {

  saveAs: (data: Blob | string, filename?: string, options?: FileSaverOptions) => void;

  constructor() {
    this.saveAs = (data: Blob | string, filename?: string, options?: FileSaverOptions) => {
      saveFile(data, filename, { ...options, autoBom: false });
    };
  }
}
