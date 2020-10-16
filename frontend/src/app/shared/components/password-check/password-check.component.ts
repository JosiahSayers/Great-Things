import { Component, Input } from '@angular/core';
import { PasswordErrors } from '@src/app/shared/services/forms/form-builders.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-password-check',
  templateUrl: './password-check.component.html',
  styleUrls: ['./password-check.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        maxHeight: '500px',
        opacity: '100%'
      })),
      state('closed', style({
        maxHeight: '0px',
        opacity: '0%'
      })),
      transition('open => closed', [
        animate('0.2s ease-in')
      ]),
      transition('closed => open', [
        animate('0.2s ease-out')
      ]),
    ]),
  ],
})
export class PasswordCheckComponent {

  @Input() errors: PasswordErrors;
  @Input() isOpen: boolean;

}
