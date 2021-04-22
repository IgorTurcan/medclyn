import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SignInPortfolioComponent } from 'src/app/smallComponents/accountDialogs/signIn/signInPortfolio.component';
import { portfolioCard } from '../portfolioCard.model';

@Component({
  selector: 'app-portfolioMain',
  templateUrl: './portfolioMain.component.html',
  styleUrls: ['./portfolioMain.component.scss']
})

export class PortfolioMainComponent implements OnInit {

	portfolioCards = [];

	dialogWidth: number;
	dialogHight: number;

	innerWidth: number = window.innerWidth;

	constructor(private titleService: Title,
		public dialog: MatDialog,
		private router: Router,
		private _snackBar: MatSnackBar,
		private authService: AuthService,
		private apiService: ApiService,
		private sanitizer: DomSanitizer) { 
			this.titleService.setTitle("Portofoliu");
		}

	ngOnInit() {
		this.apiService.postsGetAll()
			.subscribe(
				(res) => {
					if(res != null) {
						for(const post of res[Object.keys(res)[0]]) {
							let pathArray = [];
							let imageArray = [];
							for(const image of post[Object.keys(post)[2]]){
								const dataFormat = 'data:'+image[Object.keys(image)[1]]+';base64,';
								const imageData = this.sanitize(dataFormat+this._arrayBufferToBase64(image.data.data));
								pathArray.push(imageData['changingThisBreaksApplicationSecurity']);
								imageArray.push({image: imageData['changingThisBreaksApplicationSecurity']});
							}
							this.portfolioCards.push(new portfolioCard(
								post[Object.keys(post)[0]], post[Object.keys(post)[1]], pathArray, imageArray
							));
						}	
					} else {
						this._snackBar.open('No post found!', "OK", {
						  duration: 5000,
						});
					}
				}, 
				(err) => {
					this._snackBar.open(err.error.message, "OK", {
						duration: 5000,
					});
				}
			);    
	}

	logIn = () => { 
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

	haveAnyPost(): boolean {
		return this.portfolioCards.length === 0;
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

	@HostListener('window:resize') handle() { this.onResize(); }

	_arrayBufferToBase64(buffer) {
		let binary = '';
		let bytes = new Uint8Array(buffer);
		let len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	}

	sanitize(url:string) {
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}
}
