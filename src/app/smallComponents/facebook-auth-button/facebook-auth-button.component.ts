import { Component } from '@angular/core';
import { FacebookLoginProvider, SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-facebook-auth-button',
  templateUrl: './facebook-auth-button.component.html',
  styleUrls: ['./facebook-auth-button.component.scss']
})
export class FacebookAuthButtonComponent {
  constructor(private authService: SocialAuthService) { }

  signInWithFB() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
