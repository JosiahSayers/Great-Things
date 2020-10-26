import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  confirmationModalOpen = new Subject<boolean>();
  confirmationModalChoice = new Subject<'cancel' | 'confirm'>();

  openAreYouSureModal(): Observable<'cancel' | 'confirm'> {
    this.confirmationModalOpen.next(true);
    return this.confirmationModalChoice.asObservable().pipe(
      tap(() => this.confirmationModalOpen.next(false))
    );
  }
}
