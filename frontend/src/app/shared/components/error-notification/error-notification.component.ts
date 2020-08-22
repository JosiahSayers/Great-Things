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
        maxHeight: '500px'
      })),
      state('hidden', style({
        opacity: '0%',
        height: '0'
      })),
      transition('shown => hidden', [
        group([
          animate('0.2s 3s ease-in', style({
            opacity: '100%'
          })),
          animate('0.2s ease-in')
        ])
      ]),
      transition('hidden => shown', [
        animate('.2s ease-out')
      ])
    ])
  ]
})
export class ErrorNotificationComponent {

  icon = faTimesCircle;
  @Input() state: 'shown' | 'hidden';

}
