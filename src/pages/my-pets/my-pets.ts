import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {PetPage} from "../pet/pet";

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
    private angularFireDatabase: AngularFireDatabase
  ) {
    this.pets = angularFireDatabase.list('pets').valueChanges()
  }

  newPet(){
    this.navCtrl.push(PetPage)
  }

}
