import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-brandDiv',
  templateUrl: './brandDiv.component.html',
  styleUrls: ['./brandDiv.component.scss']
})
export class BrandDivComponent {
  imagePath: string = '../../assets/images/logo_mare.jpg';
  header: string = 'UN ALIAT ÎN PREVENIREA ȘI COMBATEREA VIRUSURILOR';
  content: string = `SĂNĂTATE ȘI SIGURANȚĂ | REZISTENȚĂ LA ȘOCURI, PETE, UMIDITATE
    CURĂȚARE ȘI DEZINFECTARE UȘOARĂ | DURABILITATE`;
}
