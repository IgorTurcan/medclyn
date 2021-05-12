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
	haveAnyPost: boolean = true;

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
					if(res) {
						this.haveAnyPost = true;
						for(const post of res[Object.keys(res)[0]]) {
							let pathArray = [];
							let imageArray = [];
							for(const image of post[Object.keys(post)[2]]){
								const path = image.path.slice(image.path.indexOf("assets"));
								pathArray.push(path);
								imageArray.push({image: path});
							}
							this.portfolioCards.push(new portfolioCard(
								post[Object.keys(post)[0]], post[Object.keys(post)[1]], pathArray, imageArray
							));
						}
						this.haveAnyPost = false;
					} else {
						this.haveAnyPost = false;
						this._snackBar.open('No post found!', "OK", {
						  duration: 5000,
						});
					}
				}, 
				(err) => {
					this.haveAnyPost = false;
					if(err.status === 0) {
						this._snackBar.open("No internet or no server", "OK", {
							duration: 5000,
						});
					} else {
						this._snackBar.open(err.message, "OK", {
							duration: 5000,
						});	
					}
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
}
