import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent {

  constructor(private titleService:Title) { 
    this.titleService.setTitle("Politica de confidențialitate");
   }

  goToLink(url: string){
    window.open(url, "_blank");
  }
}
