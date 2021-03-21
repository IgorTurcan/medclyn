import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-call-floating-button',
  templateUrl: './call-floating-button.component.html',
  styleUrls: ['./call-floating-button.component.scss'],
  animations: [
    trigger('transparentButton', [
      state('transparent', style({
        opacity: 0.7,
        color: '#ffffff',
        backgroundColor: '#0282C5'
      })),
      state('opaque', style({
        opacity: 1,
        color: '#0282C5',
        backgroundColor: '#ffffff'
      })),
      transition('transparent <=> opaque', animate(300))
    ]),
  ]
})

export class CallFloatingButtonComponent {
  state: string = 'transparent';

  makeTransparent() {
    this.state == 'transparent' 
    ? this.state = 'opaque' 
    : this.state = 'transparent'; 
  }

  call(phoneNumber: string) {
    window.open(`tel:${phoneNumber}`, "_self");
  }

}
