import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
	selector: 'app-addItemPortfolio',
	templateUrl: './addItemPortfolio.component.html',
	styleUrls: ['./addItemPortfolio.component.scss']
})
export class AddItemPortfolioComponent {
	title: string;
	subtitle: string;
	imageNames: Array<string> = [];
	images: Array<File> = [];


	constructor(
		public dialogRef: MatDialogRef<AddItemPortfolioComponent>, 
		private apiService: ApiService,
		private authService: AuthService,
		private _snackBar: MatSnackBar) { }

	get cardTitle(){
		return this.Data.get('cardTitle');
	}

	get cardSubtitle(){
		return this.Data.get('cardSubtitle');
	}

	Data = new FormGroup({
		cardTitle: new FormControl('',[
			Validators.required,
			Validators.pattern("^[ 0-9A-ZĂÎÂȘȚa-zăîâșț]{3,35}$")]),
		cardSubtitle: new FormControl('',[
			Validators.required,
			Validators.pattern("^[ ,0-9A-ZĂÎÂȘȚa-zăîâșț]{3,45}$")])
	});

	add(file: File) {
		this.images.push(file);
		this.imageNames.push(file.name);
	}
	
	remove(imageName: string) {
		const index = this.imageNames.indexOf(imageName);

		if (index >= 0) {
			this.images.splice(index, 1);
			this.imageNames.splice(index, 1);
		}
	}

	onFileChanged(event) {
		if (event.target.files.length !== 0) {
			const file = event.target.files[0];
			this.add(file);  
		}
	}

	addCard() {
		const title = this.Data.get('cardTitle').value;
		const subtitle = this.Data.get('cardSubtitle').value;

		const email = this.authService.getEmail();
		this.apiService.postAdd(email,title,subtitle,this.images)
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
