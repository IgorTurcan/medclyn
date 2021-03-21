import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SignInPortfolioComponent } from '../../../../smallComponents/accountDialogs/signIn/signInPortfolio.component';

@Component({
  selector: 'app-edit-floating-button',
  templateUrl: './edit-floating-button.component.html',
  styleUrls: ['./edit-floating-button.component.scss'],
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

export class EditFloatingButtonComponent {
  state: string = 'transparent';

  dialogWidth: number;
  dialogHight: number;

  innerWidth: number = window.innerWidth;

  constructor(private router: Router,
    public dialog: MatDialog,
    private authService: AuthService) {}

  makeTransparent() {
    this.state == 'transparent' 
    ? this.state = 'opaque' 
    : this.state = 'transparent'; 
  }

  logIn() { 
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/portfolio/edit/user']);
    } else {
      let dialogRef = this.dialog.open(SignInPortfolioComponent, {
        width: `${this.dialogWidth}`,
        height: `${this.dialogHight}`,
        data: { }
      });
    }
  }

  onResize() {
    this.innerWidth = window.innerWidth;
    if(window.innerWidth <= 800) { 
      this.dialogWidth = 60;
      this.dialogHight = 80;
    } else {
      this.dialogWidth = 35;
      this.dialogHight = 75;
    }
  }

}
