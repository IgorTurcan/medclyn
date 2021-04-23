import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
	selector: 'app-areas',
	templateUrl: './areas.component.html',
	styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {
	img1: string; img2: string; img3: string;
	img4: string; img5: string;
	constructor(private titleService: Title, private router: Router) {
		this.titleService.setTitle("Domenii");
	}

	ngOnInit() { this.onResize(); }

	onResize() {
		if(window.innerWidth <= 1000) { 
			this.img1 = 'https://igorturcan.github.io/medclyn/assets/images/areas/cabinet1.jpg';
			this.img2 = 'https://igorturcan.github.io/medclyn/assets/images/areas/industria_alimentara1.jpg';
			this.img3 = 'https://igorturcan.github.io/medclyn/assets/images/areas/bucatarie1.jpg';
			this.img4 = 'https://igorturcan.github.io/medclyn/assets/images/areas/usi1.jpg';
			this.img5 = 'https://igorturcan.github.io/medclyn/assets/images/areas/placa_vertical1.jpg';
		} else {
			this.img1 = 'https://igorturcan.github.io/medclyn/assets/images/areas/cabinet.jpg';
			this.img2 = 'https://igorturcan.github.io/medclyn/assets/images/areas/industria_alimentara.jpg';
			this.img3 = 'https://igorturcan.github.io/medclyn/assets/images/areas/bucatarie.jpg';
			this.img4 = 'https://igorturcan.github.io/medclyn/assets/images/areas/usi.jpg';
			this.img5 = 'https://igorturcan.github.io/medclyn/assets/images/areas/placa_vertical.jpg';
		}
	}

	@HostListener('window:resize') handling() { this.onResize(); }
}
