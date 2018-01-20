import {Component, OnDestroy} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {PetPage} from "../pet/pet";
import {AuthProvider} from "../../providers/auth/auth";
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {DbProvider} from "../../providers/db/db";
import {Subscription} from "rxjs/Subscription";

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
export class MyPetsPage implements OnInit{

  public pets: Array<any>;
  private sub: Subscription;
  constructor(
    public navCtrl: NavController,
    private dbProvider: DbProvider
  ) { }

  ionViewDidEnter() {

  }

  ionViewWillUnload() {
    this.sub.unsubscribe();
  }

  ngOnInit() {
    this.sub = this.dbProvider.myPetList.snapshotChanges()
      .subscribe(res => {
        this.pets = [];
        res.forEach(_pet=>{
          this.pets.push({data: _pet.payload.val(), key: _pet.payload.key})
        })
      })
  }





  newPet(){
    this.navCtrl.push(PetPage)
  }
  vewPet(key){
    this.navCtrl.push(PetPage,{key: key})
  }

}
