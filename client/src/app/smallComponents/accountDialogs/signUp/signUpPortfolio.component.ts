import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
	selector: 'app-signUpPortfolio',
	templateUrl: './signUpPortfolio.component.html',
	styleUrls: ['./signUpPortfolio.component.scss']
})
export class SignUpPortfolioComponent {
	passwordOK: boolean = false;

	dialogWidth: number;
	dialogHight: number;

	passType: string = 'password';
	passReType: string = 'password';



	constructor(
		public dialogRef: MatDialogRef<SignUpPortfolioComponent>,
		private _snackBar: MatSnackBar,
		private authService: AuthService,
		private apiService: ApiService) { }

	showPass() {
		this.passType = (this.passType === 'password') ? 'text' : 'password';
	}

	showRePass() {
		this.passReType = (this.passReType === 'password') ? 'text' : 'password';
	}

	checkPass() {
		let pass: string = this.Data.get('cardPassword').value;
		let repeatPass: string = this.Data.get('cardRepeatPassword').value;
		this.passwordOK = (pass === repeatPass);
	}

	get cardEmail(){
		return this.Data.get('cardEmail');
	}

	get cardPassword(){
		return this.Data.get('cardPassword');
	}

	get cardRepeatPassword(){
		return this.Data.get('cardRepeatPassword');
	}

	Data = new FormGroup({
		cardEmail: new FormControl('',[
			Validators.required,
			Validators.email]),
		cardPassword: new FormControl('',[
			Validators.required,
			Validators.pattern("^[ ,0-9A-ZĂÎÂȘȚa-zăîâșț]{5,30}$")]),
		cardRepeatPassword: new FormControl('',[
			Validators.required])
	});

	register() {
		let email = this.Data.get('cardEmail').value;
		let password = this.Data.get('cardPassword').value;
		
		this.apiService.userRegister(email, password)
			.subscribe(
				(res) => { 
					this.authService.logIn(email);  

					this._snackBar.open(res[Object.keys(res)[0]], "Great!", {
						duration: 5000,
					});
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

	foreignRegister() {
		this.dialogRef.close();
	}
}
