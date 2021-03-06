import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule, LoadingController} from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import {firebaseConfig} from "../config/environment";
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SignupComponent} from "../components/signup/signup";
import {LoginComponent} from "../components/login/login";
import {AuthPage} from "../pages/auth/auth";
import {CompleteRegistrationPage} from "../pages/complete-registration/complete-registration";
import { DbProvider } from '../providers/db/db';
import {MyPetsPage} from "../pages/my-pets/my-pets";
import {PetPage} from "../pages/pet/pet";
import {Camera} from "@ionic-native/camera";
import {ReportPage} from "../pages/report/report";
import { LoadingProvider } from '../providers/loading/loading';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    AuthPage,
    CompleteRegistrationPage,
    MyPetsPage,
    PetPage,
    ReportPage,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    AuthPage,
    CompleteRegistrationPage,
    MyPetsPage,
    PetPage,
    ReportPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    DbProvider,
    Camera,
    LoadingController,
    LoadingProvider
  ]
})
export class AppModule {}
