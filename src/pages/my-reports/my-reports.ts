import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ReportPage} from "../report/report";
import {Observable} from "rxjs/Observable";
import {DbProvider} from "../../providers/db/db";
import {Subscription} from "rxjs/Subscription";

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
export class MyReportsPage implements OnInit, OnDestroy{
  documents: Array<any>;
  sub: Subscription;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DbProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyReportsPage');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onPageWillLeave() {

  }

  ngOnInit() {
    this.sub = this.db.myDocumentList.snapshotChanges()
      .subscribe(res=>{
        this.documents = [];
        res.forEach(document=>{
          this.documents.push({data: document.payload.val(), key: document.key})
        }, err=>{
          console.log("Nuevo error: "+err);
        })

    });
  }

  viewReport(key) {

    this.navCtrl.push(ReportPage, {key: key})
  }

  newReport(){
    this.navCtrl.push(ReportPage)
  }

}
