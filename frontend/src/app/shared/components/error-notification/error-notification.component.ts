import { Component, Input } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate, stagger, group } from '@angular/animations';

@Component({
  selector: 'app-error-notification',
  templateUrl: './error-notification.component.html',
  styleUrls: ['./error-notification.component.css'],
  animations: [
    trigger('fade', [
      state('shown', style({
        maxHeight: '500px',
        display: 'block'
      })),
      state('hidden', style({
        opacity: '0%',
        height: '0',
        display: 'none'
      })),
      transition('shown => hidden', [
        group([
          animate('0.1s 0.3s', style({ display: 'none' })),
          animate('0.2s 0.2s ease-out', style({
            opacity: '100%'
          })),
          animate('0.2s ease-out')
        ])
      ]),
      transition('hidden => shown', [
        group([
          animate(10, style({ display: 'block' })),
          animate('0.2s 0.01s ease-out')
        ])
      ])
    ])
  ]
})
export class ErrorNotificationComponent {

  icon = faTimesCircle;
  @Input() state: 'shown' | 'hidden';

}
