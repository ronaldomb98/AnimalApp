import { HttpClient } from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {MenuController, Nav, NavController} from "ionic-angular";
import {AuthPage} from "../../pages/auth/auth";
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  @ViewChild(Nav) nav: Nav;
  public isLoggedIn: boolean = false;
  public currentUserUid: string = '';
  constructor(
    private angularFireAuth: AngularFireAuth,
    public menuController: MenuController
  ) {
  // this.checkLog()
  }

  public basicLogin(email: string, password: string){
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
  }

  public basicSignup(email: string, password: string){
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
  }

  public facebookLogin(){
    return this.angularFireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
  }

  public signOut() {
    return this.angularFireAuth.auth.signOut()
  }





}
