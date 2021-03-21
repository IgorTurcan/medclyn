import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvantagesComponent } from './pageComponents/advantages/advantages.component';
import { AreasComponent } from './pageComponents/areas/areas.component';
import { HomeComponent } from './pageComponents/home/home.component';
import { NotFoundComponent } from './pageComponents/notFound/notFound.component';
import { PolicyComponent } from './pageComponents/policy/policy.component';
import { PortfolioEditUserComponent } from './pageComponents/portfolio/edit/user/portfolioEditUser.component';
import { PortfolioMainComponent } from './pageComponents/portfolio/main/portfolioMain.component';
import { PortfolioComponent } from './pageComponents/portfolio/portfolio.component';
import { TechnicalComponent } from './pageComponents/technical/technical.component';
import { AuthGuard } from './services/auth/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'advantages', component: AdvantagesComponent },
  { path: 'areas', component: AreasComponent },
  { path: 'portfolio', component: PortfolioComponent, children: [
    { path: '', component: PortfolioMainComponent },
    { 
      path: 'edit/user', 
      component: PortfolioEditUserComponent,
      canActivate: [AuthGuard]
    }
  ]},
  { path: 'technical', component: TechnicalComponent },
  { path: 'not_found', component: NotFoundComponent },
  { path: 'policy', component: PolicyComponent },
  { path: '**', redirectTo: '/not_found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
