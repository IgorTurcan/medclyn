import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeComponent } from 'src/app/pageComponents/home/home.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
	selector: 'app-sendMessage',
	templateUrl: './sendMessage.component.html',
	styleUrls: ['./sendMessage.component.scss']
})
export class SendMessageComponent {
	constructor(
		public dialogRef: MatDialogRef<HomeComponent>,
		private apiService:ApiService,
		private _snackBar: MatSnackBar) {}

	get userName(){
		return this.userData.get('userName');
	}

	get userSubject(){
		return this.userData.get('userSubject');
	}
		
	get userEmail(){
		return this.userData.get('userEmail');
	}

	get userMessage(){
		return this.userData.get('userMessage');
	}

	userData = new FormGroup({
		userName: new FormControl('',[
			Validators.required,
			Validators.pattern("^[A-ZĂÎÂȘȚa-zăîâșț]+([\ A-ZĂÎÂȘȚa-zăîâșț]+)*")]),
		userSubject: new FormControl('',[
			Validators.required,
			Validators.pattern("^[A-ZĂÎÂȘȚa-zăîâșț]+([\ A-ZĂÎÂȘȚa-zăîâșț]+)*")]),
		userEmail: new FormControl('',[
			Validators.required,
			Validators.email]),
		userMessage: new FormControl('',[Validators.required])
	});  

	sendEmail() {
		let name = this.userData.get('userName').value;
		let subject = this.userData.get('userSubject').value;
		let email = this.userData.get('userEmail').value;
		let message = this.userData.get('userMessage').value;
		
		this.apiService.serviceSendEmail(name, subject, email, message)
		.subscribe(
			(res) => {
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

}
