import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private SERVER_URL = "http://localhost:5000";

	constructor(private httpClient: HttpClient) { }

	userRegister(email: string, password: string) {
		let httpParams = new HttpParams()
			.append("email", email)
			.append("password", password);

		return this.httpClient.post(
			this.SERVER_URL+'/user/register', httpParams
		);
	}

	userLogin(email: string, password: string) {
		let httpParams = new HttpParams()
			.append("email", email)
			.append("password", password);

		return this.httpClient.post(
			this.SERVER_URL+'/user/login', httpParams
		);
	}

	userDelete(email: string) {
		return this.httpClient.delete(
			this.SERVER_URL+'/user/delete/'+email,
		);
	}

	postAdd(email: string, title: string, subtitle: string, photos: Array<File>) {
		const formData = new FormData();
		formData.append("email", email);
		formData.append("title", title);
		formData.append("subtitle", subtitle);

		for(let i = 0; i < photos.length; i++){
			formData.append("photos", photos[i]);
		}

		return this.httpClient.post(
			this.SERVER_URL+'/post/add', formData
		);
	}

	postEdit(previousTitle: string, newTitle: string,
		subtitle: string, photos: Array<File>) {
		const formData = new FormData();
		formData.append("previousTitle", previousTitle);
		formData.append("newTitle", newTitle);
		formData.append("subtitle", subtitle);

		let photosWithoutUndefined = photos.filter((el) => { return el != undefined; });

		for(let i = 0; i < photosWithoutUndefined.length; i++){
			formData.append("photos", photosWithoutUndefined[i]);
		}

		return this.httpClient.put(
			this.SERVER_URL+'/post/edit', formData
		);
	}

	postDelete(email: string, title: string) {
		return this.httpClient.delete(
			this.SERVER_URL+'/post/delete/'+email+'/'+title
		);
	}

	postsGet(email: string) {
		return this.httpClient.get(
			this.SERVER_URL+'/post/get/'+email,
		);
	}

	postsGetAll() {
		return this.httpClient.get(
			this.SERVER_URL+'/post/getAll');
	}

	serviceSendEmail(name: string, subject: string, email: string, message: string) {
		let httpParams = new HttpParams()
			.append("name", name)
			.append("subject", subject)
			.append("email", email)
			.append("message", message);

		return this.httpClient.post(
			this.SERVER_URL+'/service/sendEmail', httpParams);
	}

	handleError(error: HttpErrorResponse) {
		let errorMessage = 'Unknown error!';
		if (error.error instanceof ErrorEvent) {
			errorMessage = `Client-side error: ${error.error.message}`;
		} else {
			errorMessage = `Server-side error: ${error.status}\nMessage: ${error.message}`;
		}
		window.alert(errorMessage);
		return throwError(errorMessage);
	}

	public sendGetRequest(){
		return this.httpClient.get(this.SERVER_URL).pipe(catchError(this.handleError));
	}

}
