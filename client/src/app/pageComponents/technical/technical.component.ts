import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-technical',
  templateUrl: './technical.component.html',
  styleUrls: ['./technical.component.scss']
})
export class TechnicalComponent implements OnInit {
  img: string;

  constructor(private titleService:Title) { 
    this.titleService.setTitle("Tehnic");
  }

  ngOnInit() { this.onResize(); }

  onResize() {
    if(window.innerWidth <= 1000) { 
      this.img = '../../../assets/images/areas/../placa_orizontala1.jpg';
    } else {
      this.img = '../../../assets/images/areas/../placa_orizontala.jpg';
    }
  }

  @HostListener('window:resize', ['$event']) handle(event) { this.onResize(); }

}
