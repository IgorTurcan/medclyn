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
			if(this.cookieService.get('email') === '', dateNow) {
					this.logOut();
				}
		}

	logIn(email: string) {
		const dateNow = new Date();
		dateNow.setHours(dateNow.getHours() + 2);
		this.cookieService.set('loggedIn', `${(email != '')}`,dateNow);
		this.cookieService.set('email',`${email}`,dateNow);
		this.logEvent.emit(true);
	}

	logOut() {
		this.cookieService.set('loggedIn', `${false}`);
		this.cookieService.set('email','');
		this.logEvent.emit(false);
	}

	isAuthenticated() {
		return (/true/i).test(this.cookieService.get('loggedIn'));
	}

	getEmail() {
		return this.cookieService.get('email');
	}

	getPass() {
		return this.cookieService.get('pass');
	}

	getEvent() {
		return this.logEvent;
	}

}
