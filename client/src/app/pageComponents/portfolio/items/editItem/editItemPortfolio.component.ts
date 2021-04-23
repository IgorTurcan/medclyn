import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';

@Component({
	selector: 'app-editItemP;ortfolio',
	templateUrl: './editItemPortfolio.component.html',
	styleUrls: ['./editItemPortfolio.component.scss']
})
export class EditItemPortfolioComponent implements OnInit {
	title: string;
	subtitle: string;
	imageNames: Array<string> = [];
	images: Array<File> = [];
	
	constructor(
		public dialogRef: MatDialogRef<EditItemPortfolioComponent>, 
		private apiService: ApiService,
		private _snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data) {
			this.title = data.portfolioCard.title;
			this.subtitle = data.portfolioCard.subtitle;
			for (let i=0; i<data.portfolioCard.paths.length; i++) {
				let path = data.portfolioCard.paths[i].path;
				this.images.push(path);
			}
	}

	ngOnInit() {
		this.setCardOldTitle();
		this.setCardNewTitle();
		this.setCardSubtitle();
	}

	get cardOldTitle(){
		return this.Data.get('cardOldTitle');
	}

	setCardOldTitle(){
		this.cardOldTitle.setValue(this.title);
	}

	get cardNewTitle(){
		return this.Data.get('cardNewTitle');
	}

	setCardNewTitle(){
		this.cardNewTitle.setValue(this.title);
	}

	get cardSubtitle(){
		return this.Data.get('cardSubtitle');
	}

	setCardSubtitle(){
		this.cardSubtitle.setValue(this.subtitle);
	}

	Data = new FormGroup({
		cardOldTitle: new FormControl('',[
			Validators.pattern("^[ .0-9A-ZĂÎÂȘȚa-zăîâșț]{3,35}$")]),
		cardNewTitle: new FormControl('',[
			Validators.pattern("^[ .0-9A-ZĂÎÂȘȚa-zăîâșț]{3,35}$")]),
		cardSubtitle: new FormControl('',[
			Validators.pattern("^[ .,0-9A-ZĂÎÂȘȚa-zăîâșț]{3,45}$")])
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
		if (event.target.files.length != 0) {
			const file = event.target.files[0];
			this.add(file);  
		}
	}

	update() {
		const oldTitle = this.Data.get('cardOldTitle').value;
		const newTitle = this.Data.get('cardNewTitle').value;
		const subtitle = this.Data.get('cardSubtitle').value;

		this.apiService.postEdit(oldTitle, newTitle, subtitle, this.images)
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
