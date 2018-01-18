import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ReportPage} from "../report/report";

/**
 * Generated class for the MyReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-reports',
  templateUrl: 'my-reports.html',
})
export class MyReportsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyReportsPage');
  }

  newReport(){
    this.navCtrl.push(ReportPage)
  }

}
