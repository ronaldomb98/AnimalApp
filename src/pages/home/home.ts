import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {DbProvider} from "../../providers/db/db";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {Subscription} from "rxjs/Subscription";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  public news;
  private browser;
  private sub: Subscription;
  constructor(
    public navCtrl: NavController,
    private dbProvider: DbProvider,
    private iab: InAppBrowser
  ) {

  }

  ngOnInit(){
    this.news= this.dbProvider.newList.valueChanges()
  }

  openNewInBrowser(url){
    this.browser = this.iab.create(url)
  }





}
