import { Injectable, Inject } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class WebStorageService implements StorageService {

  private storage: Storage;

  constructor(@Inject('window') private window: Window) {
    this.storage = window.localStorage;
  }

  set(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  get(key: string): string {
    return this.storage.getItem(key);
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  removeAll(): void {
    this.storage.clear();
  }
}
