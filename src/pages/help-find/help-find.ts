import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {DbProvider} from "../../providers/db/db";
import {AngularFireList, SnapshotAction} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { MyAccountPage } from '../my-account/my-account';
import {Subscription} from "rxjs/Subscription";

/**
 * Generated class for the HelpFindPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-help-find',
  templateUrl: 'help-find.html',
})
export class HelpFindPage implements OnInit, OnDestroy{

  private documentType;
  private metadata;
  private documents: Observable<any[]>;
  private relatedDocuments;
  private documentsToAnalize;
  public topic: string;
  private sub: Subscription;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private dbProvider: DbProvider,
    public modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.documentType = this.navParams.get('documentType');
    this.metadata = this.navParams.get('metadata');
    console.log(JSON.stringify(this.metadata));
    if (this.documentType == 'Perdida') {
      this.topic = 'Abandonadas';
      this.documents = this.dbProvider.documentListByType('Abandono').snapshotChanges();
    } else {
      this.topic = 'Perdidas';
      this.documents = this.dbProvider.documentListByType('Perdida').snapshotChanges()
    }

    this.filterBySimilitudes();
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  private filterBySimilitudes(){
    console.log("Iniciando filtro")
    let anotations = [];
    let petAnotations = [];
    this.sub = this.documents.subscribe((_documents:any)=>{
      this.documentsToAnalize = _documents;
      this.relatedDocuments = [];
      console.log("documentos a analizar");
      console.log(JSON.stringify(_documents));
      // Get my metadata
      let _petmetadata = this.metadata.responses;
      let _petAnotations = [];
      _petmetadata.forEach(data=>{
        data.labelAnnotations.forEach(annotation => {
          _petAnotations.push(annotation.description);
        });
      })


      // Get metadata for each pet
      _documents.forEach(document=>{
        document = document.payload.val();
        if (document.details){
          let _metadata = document.details.responses;
          let _anotations = [];
          _metadata.forEach(data=>{
            data.labelAnnotations.forEach(annotation => {
              _anotations.push(annotation.description);
            });
          })


          // Compare data
          let counter = 0;
          _petAnotations.forEach(__petAnotation=>{
            _anotations.forEach(__anotation=>{
              if (__petAnotation == __anotation){
                counter++;
              }
            });
          });

          if (counter>=3){
            this.relatedDocuments.push(document)
          }
        }
      });

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpFindPage');
  }

  presentProfileModal(key) {
    let profileModal = this.modalCtrl.create(MyAccountPage, { key: key });
    profileModal.present();
  }

}
