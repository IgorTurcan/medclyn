import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { NavigationComponent } from 'src/app/layoutComponents/navigation/navigation.component';

@Component({
	selector: 'app-top-floating-button',
	templateUrl: './top-floating-button.component.html',
	styleUrls: ['./top-floating-button.component.scss'],
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

export class TopFloatingButtonComponent {
	state: string = 'transparent';

	constructor(private navC: NavigationComponent) { }

	makeTransparent() {
		this.state == 'transparent' 
		? this.state = 'opaque' 
		: this.state = 'transparent'; 
	}

	goToTop() {
		this.navC.top.nativeElement.scrollIntoView();
	}

}
