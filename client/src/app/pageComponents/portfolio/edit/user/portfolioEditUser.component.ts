import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
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

  state: string = 'blue';

  dialogWidth: number;
  dialogHight: number;

  innerWidth: number = window.innerWidth;

  constructor(private titleService: Title, 
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { 
    this.titleService.setTitle("Postările tale");
  }

  ngOnInit() {
    this.getPosts();
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

    dialogRef.afterClosed().subscribe( () => {
      this.getPosts();
    });
  }

  goEdit(index: number) {
    let dialogRef = this.dialog.open(EditItemPortfolioComponent, {
      width: `${this.dialogWidth}`,
      height: `${this.dialogHight}`,
      data: { portfolioCard: this.portfolioCards[index] }
    });

    dialogRef.afterClosed().subscribe( () => {
      this.getPosts();
    });
  }

  delete(index: number, title: string) {
    const email = this.authService.getEmail();
    this.apiService.postDelete(email,title)
		.subscribe(
      (res) => {
        this._snackBar.open(res[Object.keys(res)[0]], "Great!", {
          duration: 5000,
        });
      },
      (err) => {
        this._snackBar.open(err.error.message, "OK", {
          duration: 5000,
        });
      }
    );

    this.portfolioCards.splice(index, 1);
  }

  deleteAccount() {
    let res = confirm("You are sure you want to delete this account?");
    if (res) {
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
          this._snackBar.open(err.error.message, "OK", {
            duration: 5000,
          });
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

  getPosts() {
    const cards = [];
    const email = this.authService.getEmail();
    this.apiService.postsGet(email)
		.subscribe(
			(res) => {
        if(res != null) {
          for(const post of res[Object.keys(res)[0]]) {
            let pathArray = [];
            let imageArray = [];
            const dataFormat = 'data:image/png;base64,';
  
            for(const path of post.paths) {
              pathArray.push(dataFormat+path);
              imageArray.push({ image: dataFormat+path });
            }
  
            cards.push(new portfolioCard(
              post.title, post.subtitle, pathArray, imageArray
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
      },
      () => {
        this.portfolioCards = cards;
      }
    ); 

  }

  @HostListener('window:resize') handle() { this.onResize(); }

}