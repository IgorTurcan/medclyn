import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AddItemPortfolioComponent } from '../../items/addItem/addItemPortfolio.component';
import { EditItemPortfolioComponent } from '../../items/editItem/editItemPortfolio.component';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { portfolioCard } from '../../portfolioCard.model';

@Component({
	selector: 'app-portfolioEditUser',
	templateUrl: './portfolioEditUser.component.html',
	styleUrls: ['./portfolioEditUser.component.scss'],
	animations: [
		trigger('onHover', [
			state('blue', style({
				color: '#ffffff',
				backgroundColor: '#0282C5'
			})),
			state('white', style({
				color: '#0282C5',
				backgroundColor: '#ffffff'
			})),
			transition('blue <=> white', animate(300))
		]),
	]
})

export class PortfolioEditUserComponent implements OnInit {
	portfolioCards = [];
	haveAnyPost: boolean = true;

	state: string = 'blue';

	dialogWidth: number;
	dialogHight: number;

	innerWidth: number = window.innerWidth;

	constructor(private titleService: Title, 
		private authService: AuthService,
		private apiService: ApiService,
		private router: Router,
		private _snackBar: MatSnackBar,
		public dialog: MatDialog,
		private sanitizer: DomSanitizer) { 
		this.titleService.setTitle("Postările tale");
	}

	ngOnInit() {
		this.setPosts();
	}

	changeState() {
		this.state == 'blue' 
		? this.state = 'white' 
		: this.state = 'blue'; 
	}

	logOut = () => {
		this.router.navigate(['/portfolio']);
	}

	add() {
		let dialogRef = this.dialog.open(AddItemPortfolioComponent, {
			width: `${this.dialogWidth}`,
			height: `${this.dialogHight}`,
			data: { }
		});

		// dialogRef.afterClosed().subscribe( () => {
		// 	this.setPosts();
		// });
	}

	goEdit(index: number) {
		let dialogRef = this.dialog.open(EditItemPortfolioComponent, {
			width: `${this.dialogWidth}`,
			height: `${this.dialogHight}`,
			data: { portfolioCard: this.portfolioCards[index] }
		});

		// dialogRef.afterClosed().subscribe( () => {
		// 	this.setPosts();
		// });
	}

	delete(index: number, title: string) {
		const email = this.authService.getEmail();
		this.apiService.postDelete(email, title)
		.subscribe(
			(res) => {
				this._snackBar.open(res[Object.keys(res)[0]], "Great!", {
					duration: 5000,
				});
				this.portfolioCards.splice(index, 1);
			},
			(err) => {
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

	deleteAccount() {
		let res = confirm("You are sure you want to delete this account?");
		if(res) {
			const email = this.authService.getEmail();
			this.apiService.userDelete(email)
			.subscribe(
				(res) => {
					this._snackBar.open(res[Object.keys(res)[0]], "Great!", {
						duration: 5000,
					});

					this.authService.logOut();
					this.router.navigate(['/portfolio']);
				},
				(err) => {
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
	}

	onResize() {
		this.innerWidth = window.innerWidth;
		if(window.innerWidth <= 1000) { 
			this.dialogWidth = 60;
			this.dialogHight = 80;
		} else {
			this.dialogWidth = 35;
			this.dialogHight = 75;
		}
	}
	
	setPosts() {
		const email = this.authService.getEmail();
		this.apiService.postsGet(email)
			.subscribe(
				(res) => {
					if(res) {
						this.haveAnyPost = true;
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