import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SignUpPortfolioComponent } from '../signUp/signUpPortfolio.component';

@Component({
	selector: 'app-signInPortfolio',
	templateUrl: './signInPortfolio.component.html',
	styleUrls: ['./signInPortfolio.component.scss']
})
export class SignInPortfolioComponent {
	dialogWidth: number;
	dialogHight: number;

	passType: string = 'password';

	constructor(
		public dialogRef: MatDialogRef<SignInPortfolioComponent>, 
		public dialog: MatDialog, 
		private _snackBar: MatSnackBar,
		private authService: AuthService,
		private apiService: ApiService) { }

	showPass() {
		this.passType = (this.passType === 'password') ? 'text' : 'password';
	}

	get cardEmail(){
		return this.Data.get('cardEmail');
	}

	get cardPassword(){
		return this.Data.get('cardPassword');
	}

	Data = new FormGroup({
		cardEmail: new FormControl('',[
			Validators.required,
			Validators.email]),
		cardPassword: new FormControl('',[
			Validators.required,
			Validators.pattern("^[ ,0-9A-ZĂÎÂȘȚa-zăîâșț]{5,30}$")])
	});

	logIn() {
		let email = this.Data.get('cardEmail').value;
		let password = this.Data.get('cardPassword').value;

		this.apiService.userLogin(email, password)
			.subscribe(
				(res) => {
					if(res['auth']) {
						this.authService.logIn(email);

						this._snackBar.open(res[Object.keys(res)[0]], "Great!", {
							duration: 5000,
						});  
					} else if(!res['auth']) {
						this._snackBar.open("Authentication failed!", "OK!", {
							duration: 5000,
						});  
					}
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

		this.dialogRef.close();  
	}

	register () { 
		this.dialog.open(SignUpPortfolioComponent, {
			width: `${this.dialogWidth}`,
			height: `${this.dialogHight}`,
			data: { }
		});

		this.dialogRef.close();
	}

	onResize() {
		if(window.innerWidth <= 1000) { 
			this.dialogWidth = 60;
			this.dialogHight = 80;
		} else {
			this.dialogWidth = 35;
			this.dialogHight = 75;
		}
	}

	@HostListener('window:resize') handle() { this.onResize(); }
}
