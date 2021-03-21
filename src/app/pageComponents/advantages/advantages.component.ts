import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-advantages',
  templateUrl: './advantages.component.html',
  styleUrls: ['./advantages.component.scss']
})
export class AdvantagesComponent implements OnInit {
  img1: string; img2: string;
  img3: string; img4: string;

  constructor(private titleService:Title) {
    this.titleService.setTitle("Avantaje");
  }

  ngOnInit() { this.onResize(); }

  onResize() {
    if(window.innerWidth <= 1000) { 
      this.img1 = '../../../assets/images/advantages/femeie1.jpg';
      this.img2 = '../../../assets/images/placa_orizontala1.jpg';
      this.img3 = '../../../assets/images/advantages/perete1.jpg';
      this.img4 = '../../../assets/images/advantages/doctori1.jpg';
    } else {
      this.img1 = '../../../assets/images/advantages/femeie.jpg';
      this.img2 = '../../../assets/images/placa_orizontala.jpg';
      this.img3 = '../../../assets/images/advantages/perete.jpg';
      this.img4 = '../../../assets/images/advantages/doctori.jpg';
    }
  }

  @HostListener('window:resize', ['$event']) handle(event) { this.onResize(); }

}
