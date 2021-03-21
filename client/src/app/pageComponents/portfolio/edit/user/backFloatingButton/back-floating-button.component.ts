import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SignInPortfolioComponent } from '../../../../../smallComponents/accountDialogs/signIn/signInPortfolio.component';

@Component({
  selector: 'app-back-floating-button',
  templateUrl: './back-floating-button.component.html',
  styleUrls: ['./back-floating-button.component.scss'],
  animations: [
    trigger('transparentButton', [
      state('transparent', style({
        opacity: 0.7,
        color: '#ffffff',
        backgroundColor: '#226472'
      })),
      state('opaque', style({
        opacity: 1,
        color: '#226472',
        backgroundColor: '#ffffff'
      })),
      transition('transparent <=> opaque', animate(300))
    ]),
  ]
})

export class BackFloatingButtonComponent {
  state: string = 'transparent';

  constructor(private router: Router) {}

  makeTransparent() {
    this.state == 'transparent' 
    ? this.state = 'opaque' 
    : this.state = 'transparent'; 
  }

  back() { 
    this.router.navigate(['/portfolio']);
  }

}
