import { Component, Input } from '@angular/core';
import { faBan, faCheckSquare, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pass-fail-list-item',
  templateUrl: './pass-fail-list-item.component.html',
  styleUrls: ['./pass-fail-list-item.component.css']
})
export class PassFailListItemComponent {

  faBan = faBan;
  faCheckSquare = faCheckSquare;

  @Input() passing: boolean;

  get currentIcon(): IconDefinition {
    return this.passing ? this.faCheckSquare : faBan;
  }

  get currentTextClass(): string {
    return this.passing ? 'has-text-success' : 'has-text-danger';
  }

}
