import {CdkTableModule} from '@angular/cdk/table';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {  RouterModule } from '@angular/router';
import {HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ParallaxModule} from 'ngx-parallax';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatInputModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatBottomSheetModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatFormFieldModule, MatBadgeModule,
} from '@angular/material';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {ListService} from './services/list.service';
import { HkComponent } from './hk/hk.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {LostComponent} from './lost/lost.component';
import {AuthService} from './services/auth.service';
import {EnsureAuthenticatedService} from './services/ensure-authenticated.service';
import {LoginRedirectService} from './services/login-redirect.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { InspectionComponent } from './inspection/inspection.component';
import {InspectionService} from './services/inspection.service';
import { UpdatelostComponent } from './updatelost/updatelost.component';
import { InventoryComponent } from './inventory/inventory.component';
import { UpdatereturnedComponent } from './updatereturned/updatereturned.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {environment} from '../environments/environment';
import { ChatComponent } from './chat/chat.component';
const config: SocketIoConfig = { url: environment.baseUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HkComponent,
    LostComponent,
    LoginComponent,
    HomeComponent,
    InspectionComponent,
    UpdatelostComponent,
    InventoryComponent,
    UpdatereturnedComponent,
    ChatComponent
  ],
  imports: [
    ParallaxModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    MatFormFieldModule,
    MatRadioModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatBottomSheetModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatBadgeModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    MDBBootstrapModule.forRoot(),
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([
      { path: 'hk', component: HkComponent, canActivate: [EnsureAuthenticatedService]},
      { path: '', component: HomeComponent},
      { path: 'lost', component: LostComponent, canActivate: [LoginRedirectService]},
      { path: 'login', component: LoginComponent},
      { path: 'inspection', component: InspectionComponent, canActivate: [LoginRedirectService]},
      { path: '**', redirectTo: ''}
    ], {useHash: true})
  ],
  providers: [ListService, AuthService, EnsureAuthenticatedService, LoginRedirectService, InspectionService],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ],
  entryComponents: [
    UpdatelostComponent,
    UpdatereturnedComponent
  ]
})
export class AppModule { }
