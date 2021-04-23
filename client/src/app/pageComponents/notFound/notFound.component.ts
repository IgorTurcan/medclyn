import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
	selector: 'app-notFound',
	templateUrl: './notFound.component.html',
	styleUrls: ['./notFound.component.scss']
})

export class NotFoundComponent {

	constructor(private titleService:Title, private router: Router){ 
		this.titleService.setTitle("Page not found");
	}

	toHome() {
		this.router.navigate(['/home']);
	}

}
