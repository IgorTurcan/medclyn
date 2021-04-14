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
	private sanitizer:DomSanitizer) { 
	this.titleService.setTitle("Portofoliu");
  }

ngOnInit() {
	this.apiService.postsGetAll()
		.subscribe(
			(res) => {
				for(const post of res[Object.keys(res)[0]]) {
					let pathArray = [];
		    		let imageArray = [];
					for(const image of post[Object.keys(post)[2]]){
						const dataFormat = 'data:'+image[Object.keys(image)[1]]+';base64,';
						pathArray.push(this.sanitize(dataFormat+this._arrayBufferToBase64(image.data.data)));
						imageArray.push({image: this.sanitize(dataFormat+this._arrayBufferToBase64(image.data.data))});
					}
					this.portfolioCards.push(new portfolioCard(
						post[Object.keys(post)[0]], post[Object.keys(post)[1]], pathArray, imageArray
					));
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


  _arrayBufferToBase64( buffer ) {
	var binary = '';
	var bytes = new Uint8Array( buffer );
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
	   binary += String.fromCharCode( bytes[ i ] );
	}
	return window.btoa( binary );
  }

  sanitize( url:string ) {
	return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
