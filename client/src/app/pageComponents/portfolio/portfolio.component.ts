import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
	selector: 'app-portfolio',
	template: `
	<div class="title">
		<p class="text">Portofoliu lucrări</p>
	</div>
	<router-outlet></router-outlet>`,
	styleUrls: ['./portfolio.component.scss']
})

export class PortfolioComponent {
	constructor(private router: Router, private authService: AuthService) {}
}