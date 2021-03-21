import { EventEmitter, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  private logEvent: EventEmitter<Boolean> = new EventEmitter();

  constructor(private cookieService: CookieService) {
      const dateNow = new Date();
      dateNow.setHours(dateNow.getHours() + 2);
      if(this.cookieService.get('email') === '' &&
        this.cookieService.get('token') === '', dateNow) {
          this.logOut();
        }
    }

  logIn(email: string, token: string) {
    const dateNow = new Date();
    dateNow.setHours(dateNow.getHours() + 2);
    this.cookieService.set('loggedIn', `${(email != '') && (token != '')}`,dateNow);
    this.cookieService.set('email',`${email}`,dateNow);
    this.cookieService.set('token',`${token}`,dateNow);
    this.logEvent.emit(true);
  }

  logOut() {
    this.cookieService.set('loggedIn', `${false}`);
    this.cookieService.set('email','');
    this.cookieService.set('token','');
    this.logEvent.emit(false);
  }

  isAuthenticated() {
    return (/true/i).test(this.cookieService.get('loggedIn'));
  }

  getEmail() {
    return this.cookieService.get('email');
  }

  getToken() {
    return this.cookieService.get('token');
  }

  getEvent() {
    return this.logEvent;
  }

}
