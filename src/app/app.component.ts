import { Component, ViewChild } from '@angular/core';
import {App, LoadingController, MenuController, Nav, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {AuthProvider} from "../providers/auth/auth";
import {AngularFireAuth} from "angularfire2/auth";
import {AuthPage} from "../pages/auth/auth";
import {CompleteRegistrationPage} from "../pages/complete-registration/complete-registration";
import {DbProvider} from "../providers/db/db";
import {Subscription} from "rxjs/Subscription";
import {MyPetsPage} from "../pages/my-pets/my-pets";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AuthPage;
  userDataSub: Subscription = new Subscription();
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public angularFireAuth: AngularFireAuth,
    public authProvider: AuthProvider,
    public app: App,
    public menuController: MenuController,
    public dbProvider: DbProvider,
    public loadingCtrl: LoadingController
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'Mis Mascotas', component: MyPetsPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkLog();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  public signOut() {
    this.nav.setRoot(HomePage).then(()=>{
      this.nav.popToRoot().then(()=>{
        this.authProvider.signOut();
      });

    });


  }

  public checkLog() {
    this.angularFireAuth.authState.subscribe(res=>{
      this.authProvider.currentUserUid = res ? res.uid : '';
      const _flag: boolean = res ? true : false;
      this.authProvider.isLoggedIn = _flag;
      this.menuController.enable(_flag);
      if (!_flag) {
        this.nav.setRoot(AuthPage).then(()=>{
          this.userDataSub.unsubscribe();
          this.nav.popToRoot()
        })
      }else {
        this.dbProvider.userDataRef = this.dbProvider.db.object('users-data/' +  this.authProvider.currentUserUid)
        this.userDataSub = this.dbProvider.userDataRef.valueChanges().subscribe(res=>{
          console.log(this.dbProvider.userDataRef)
          if (res){
            this.nav.setRoot(HomePage).then(()=>{
              this.nav.popToRoot()
            })
          } else {
            this.nav.setRoot(CompleteRegistrationPage).then(()=>{
              this.nav.popToRoot()
            })
          }
        })

      }
    }, err=>{
      console.log(err)
    })
  }
}
