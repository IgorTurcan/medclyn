import { Component, HostListener, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { SendMessageComponent } from 'src/app/smallComponents/sendMessage/sendMessage.component';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-bottomSheet',
  templateUrl: './bottomSheet.component.html',
  styleUrls: ['./bottomSheet.component.scss']
})
export class BottomSheetComponent implements OnInit {
  locationLink = "https://www.google.com/maps/place/Srada+Oltului+141,+B%C4%83icoi+105200,+Romania/@45.0237106,25.8815868,17z/data=!3m1!4b1!4m5!3m4!1s0x40b25284355679f5:0xf6049a730192d094!8m2!3d45.0237068!4d25.8837755?hl=en-GB&authuser=0";

  dialogWidth: number;
  dialogHight: number;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<HomeComponent>, 
    private _clipboardService: ClipboardService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) {}

  ngOnInit() { this.onResize(); }

  call(phoneNumber: string) {
    window.open(`tel:${phoneNumber}`, "_self");
  }

  goToLocation() { 
    window.open(this.locationLink, "_blank"); 
    this._bottomSheetRef.dismiss(); 
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
    this._bottomSheetRef.dismiss();
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
