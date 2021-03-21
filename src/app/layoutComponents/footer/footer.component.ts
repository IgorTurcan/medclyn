import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faFacebook, faInstagram, faYoutube} from '@fortawesome/free-brands-svg-icons';
import { ClipboardService } from 'ngx-clipboard';
import { SendMessageComponent } from 'src/app/smallComponents/sendMessage/sendMessage.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {
  locationLink = "https://www.google.com/maps/place/Srada+Oltului+141,+B%C4%83icoi+105200,+Romania/@45.0237106,25.8815868,17z/data=!3m1!4b1!4m5!3m4!1s0x40b25284355679f5:0xf6049a730192d094!8m2!3d45.0237068!4d25.8837755?hl=en-GB&authuser=0";
  
  dialogWidth: number;
  dialogHight: number;

  facebook = faFacebook;
  instagram = faInstagram;
  youtube = faYoutube;

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar,
    private _clipboardService: ClipboardService) {}

  ngOnInit() { this.onResize(); }

  call(phoneNumber: string) {
    window.open(`tel:${phoneNumber}`, "_self");
  }

  goToLocation() { 
    window.open(this.locationLink, "_blank"); 
  }

  copySnackBar(textName: string) {
    this._snackBar.open(`${textName} a fost copiat!`, "OK", {
      duration: 5000,
    });
  }

  openEmailDialog() {
    const dialogRef = this.dialog.open(SendMessageComponent, {
      width: `${this.dialogWidth}%`,
      height: `${this.dialogHight}%`,
      data: {}
    });
  }


  snackBarOnCopy() { this._snackBar.open('Copiat cu succes!', "OK", {duration: 2000}); }

  goToLink(url: string){ window.open(url, "_blank"); }

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
