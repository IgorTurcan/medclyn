import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SignInPortfolioComponent } from 'src/app/smallComponents/accountDialogs/signIn/signInPortfolio.component';
import { SignUpPortfolioComponent } from 'src/app/smallComponents/accountDialogs/signUp/signUpPortfolio.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})

export class NavigationComponent implements OnInit {
  @ViewChild('drawer') sidenav: MatSidenav;
  @ViewChild('top') top : ElementRef;

  logInOrLogOut = 'Loghează-te';
  registerOrUsername = 'Creează un cont';

  innerWidth: number;

  dialogWidth: number;
  dialogHight: number;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService) {
    router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.top.nativeElement.scrollIntoView();
      }
    });
  }

  ngOnInit() {
    this.changeOnAuth();
    this.onResize()
  }

  close() {
    this.sidenav.close();
  }

  toHome() {
    this.router.navigate(['/home']);
  }

  mobileSize(): boolean {
    return this.innerWidth <= 900;
  }

  logInOrLogOutFunc() { 
    if(this.authService.isAuthenticated()) {
      this.authService.logOut();
    } else {
      let dialogRef = this.dialog.open(SignInPortfolioComponent, {
        width: `${this.dialogWidth}`,
        height: `${this.dialogHight}`,
        data: { }
      });
    }
  }

  registerOrUsernameFunc() { 
    if(!this.authService.isAuthenticated()) {
      this.dialog.open(SignUpPortfolioComponent, {
        width: `${this.dialogWidth}`,
        height: `${this.dialogHight}`,
        data: { }
      });
    }
  }

  changeOnAuth() {
    this.authService.getEvent()
    .subscribe( res => {
      if(res) {
        this.logInOrLogOut = 'Deconectează-te';
        this.registerOrUsername = this.authService.getEmail();
      } else {
        this.logInOrLogOut = 'Loghează-te';
        this.registerOrUsername = 'Creează un cont';
      }
    });
  }

  onResize() { this.innerWidth = window.innerWidth; }

  @HostListener('window:resize') handle() { this.onResize(); }

}
