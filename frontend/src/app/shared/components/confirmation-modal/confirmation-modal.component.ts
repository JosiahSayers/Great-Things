import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  isActive = false;

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.modalService.confirmationModalOpen().subscribe({
      next: (open) => this.isActive = open
    });
  }

  sendChoice(choice: 'cancel' | 'confirm'): void {
    this.modalService.sendConfirmationModalChoice(choice);
  }

}
