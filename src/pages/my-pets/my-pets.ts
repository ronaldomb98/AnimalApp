import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {PetPage} from "../pet/pet";
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the MyPetsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-pets',
  templateUrl: 'my-pets.html',
})
export class MyPetsPage {

  public pets: Observable<any[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private angularFireDatabase: AngularFireDatabase,
    private authProvider: AuthProvider
  ) {
    this.pets = angularFireDatabase
      .list('pets', ref => ref.orderByChild('userId').equalTo(this.authProvider.currentUserUid))
      .valueChanges()

  }

  newPet(){
    this.navCtrl.push(PetPage)
  }
  vewPet(){
    alert("En Desarrollo")
  }

}
