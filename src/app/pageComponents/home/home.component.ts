import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { BottomSheetComponent } from './bottomSheet/bottomSheet.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('contentAppear', [
      state('down', style({
        transform: 'translateY(100%)'
      })),
      state('up', style({
        transform: 'none'
      })),
      transition('down <=> up', animate(850))
    ])
  ]
})

export class HomeComponent {
  state1: string = 'down';
  state2: string = 'down';
  state3: string = 'down';
  state4: string = 'down';
  state5: string = 'down';
  state6: string = 'down';
  
  constructor(
    private titleService:Title, 
    private _bottomSheet: MatBottomSheet, 
    private router: Router) {
      this.titleService.setTitle("MedClyn®");
    }
  
  turnCard(i: number) { 
    switch(i) {
      case 1: this.state1 == 'down' ? this.state1 = 'up' : this.state1 = 'down'; 
      break;
      case 2: this.state2 == 'down' ? this.state2 = 'up' : this.state2 = 'down'; 
      break;
      case 3: this.state3 == 'down' ? this.state3 = 'up' : this.state3 = 'down'; 
      break;
      case 4: this.state4 == 'down' ? this.state4 = 'up' : this.state4 = 'down'; 
      break;
      case 5: this.state5 == 'down' ? this.state5 = 'up' : this.state5 = 'down'; 
      break;
      case 6: this.state6 == 'down' ? this.state6 = 'up' : this.state6 = 'down'; 
      break;
    }
  };

  toAreas() {
    this.router.navigate(['/areas']);
  }

  toAdvantages() {
    this.router.navigate(['/advantages']);
  }

  openBottomSheet() {
    this._bottomSheet.open(BottomSheetComponent);
  }

}
