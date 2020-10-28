import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private _confirmationModalOpen = new Subject<boolean>();
  private _confirmationModalChoice = new Subject<'cancel' | 'confirm'>();

  confirmationModalOpen(): Observable<boolean> {
    return this._confirmationModalOpen.asObservable();
  }

  confirmationModalChoice(): Observable<'cancel' | 'confirm'> {
    return this._confirmationModalChoice.asObservable();
  }

  sendConfirmationModalChoice(choice: 'cancel' | 'confirm'): void {
    this._confirmationModalChoice.next(choice);
  }

  openAreYouSureModal(): Observable<'cancel' | 'confirm'> {
    this._confirmationModalOpen.next(true);
    return this._confirmationModalChoice.asObservable().pipe(
      tap(() => this._confirmationModalOpen.next(false))
    );
  }
}
