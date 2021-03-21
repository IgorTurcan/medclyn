import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { MatFileUploadModule } from 'angular-material-fileupload';

import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTreeModule } from '@angular/material/tree';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ClipboardModule } from 'ngx-clipboard';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
 
import { AdvantagesComponent } from './pageComponents/advantages/advantages.component';
import { AreasComponent } from './pageComponents/areas/areas.component';
import { HomeComponent } from './pageComponents/home/home.component';
import { PortfolioComponent } from './pageComponents/portfolio/portfolio.component';
import { TechnicalComponent } from './pageComponents/technical/technical.component';
import { NavigationComponent } from './layoutComponents/navigation/navigation.component';
import { FooterComponent } from './layoutComponents/footer/footer.component';
import { NotFoundComponent } from './pageComponents/notFound/notFound.component';
import { PolicyComponent } from './pageComponents/policy/policy.component';
import { SendMessageComponent } from './smallComponents/sendMessage/sendMessage.component';
import { BrandDivComponent } from './smallComponents/brandDiv/brandDiv.component';
import { PortfolioMainComponent } from './pageComponents/portfolio/main/portfolioMain.component';
import { PortfolioEditUserComponent } from './pageComponents/portfolio/edit/user/portfolioEditUser.component';
import { EditFloatingButtonComponent } from './pageComponents/portfolio/main/editFloatingButton/edit-floating-button.component';
import { CallFloatingButtonComponent } from './layoutComponents/navigation/callFloatingButton/call-floating-button.component';
import { TopFloatingButtonComponent } from './layoutComponents/navigation/topFloatingButton/top-floating-button.component';
import { BackFloatingButtonComponent } from './pageComponents/portfolio/edit/user/backFloatingButton/back-floating-button.component';
import { BottomSheetComponent } from './pageComponents/home/bottomSheet/bottomSheet.component';
import { EditItemPortfolioComponent } from './pageComponents/portfolio/items/editItem/editItemPortfolio.component';
import { AddItemPortfolioComponent } from './pageComponents/portfolio/items/addItem/addItemPortfolio.component';
import { GoogleAuthButtonComponent } from './smallComponents/google-auth-button/google-auth-button.component';
import { FacebookAuthButtonComponent } from './smallComponents/facebook-auth-button/facebook-auth-button.component';
import { HttpClientModule } from '@angular/common/http';
import { SignInPortfolioComponent } from './smallComponents/accountDialogs/signIn/signInPortfolio.component';
import { SignUpPortfolioComponent } from './smallComponents/accountDialogs/signUp/signUpPortfolio.component';

import { AuthGuard } from './services/auth/auth.guard';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    AppComponent,
    AdvantagesComponent,
    AreasComponent,
    HomeComponent,
    PortfolioComponent,
    PortfolioEditUserComponent,
    TechnicalComponent,
    BottomSheetComponent,
    NavigationComponent,
    SendMessageComponent,
    FooterComponent,
    NotFoundComponent,
    PolicyComponent,
    BrandDivComponent,
    EditFloatingButtonComponent,
    CallFloatingButtonComponent,
    TopFloatingButtonComponent,
    BackFloatingButtonComponent,
    PortfolioMainComponent,
    EditItemPortfolioComponent,
    AddItemPortfolioComponent,
    SignInPortfolioComponent,
    SignUpPortfolioComponent,
    GoogleAuthButtonComponent,
    FacebookAuthButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatBottomSheetModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    LayoutModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTreeModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ClipboardModule,
    IvyCarouselModule,
    NgImageFullscreenViewModule,
    MatChipsModule,
    SocialLoginModule,
    HttpClientModule,
    MatBadgeModule,
    MatFileUploadModule 
  ],
  providers: [
    ApiService,
    AuthGuard,
    CookieService
    // ,{
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(
    //           '955186114298-1cfdbu5kaioqv9h1dd0unte6lf2r9cii'
    //         )
    //       },
    //       {
    //         id: FacebookLoginProvider.PROVIDER_ID,
    //         provider: new FacebookLoginProvider('367249327652188')
    //       }
    //     ]
    //   } as SocialAuthServiceConfig,
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
