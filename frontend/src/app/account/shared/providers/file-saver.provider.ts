import { InjectionToken } from '@angular/core';
import { saveAs } from 'file-saver';

export type FileSaver = (blob: Blob, filename?: string) => void;

export const fileSaverInjectionToken = new InjectionToken<FileSaver>('file-saver');

export function getFileSaver(): FileSaver {
  return saveAs;
}
