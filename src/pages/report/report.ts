import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {DbProvider} from "../../providers/db/db";
import {Observable} from "rxjs/Observable";

import {GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent} from "@ionic-native/google-maps";
import * as firebase from "firebase";
import {LoadingProvider} from "../../providers/loading/loading";
import { ApiProvider } from '../../providers/api/api';
import { Subscription } from 'rxjs/Subscription';
import {HelpFindPage} from "../help-find/help-find";

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage implements OnInit{

  // Global variables
  captureDataUrl: string;
  documentTypeList: Observable<any[]>;
  _geoAnswer: any = null;
  map: GoogleMap;
  urlToDownload: string = null;
  isOnlyView: boolean = false;
  key: string;
  oldImageUrl: string;

  // Handle image analysis data
  private isAnalizing: boolean = false;
  private isAnalizingMessage: string = '';
  private imageAnalysis;
  private textDebug; // To delete
  private imageAnalisisTransalted: any;
  private subApi: Subscription;
  private isLookingForHelp: boolean = false;
  public form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private camera: Camera,
    private dbProvider: DbProvider,
    private googleMaps: GoogleMaps,
    private loadingProvider: LoadingProvider,
    private apiProvider: ApiProvider
  ) {
  }

  ionViewDidLoad(){
    this.loadMap();
    console.log("HOLA MAMAMAAA");
  }

  ngOnInit(): void {

    this.key = this.navParams.get('key');
    this.documentTypeList = this.dbProvider.listDocumentType();
    this.buildForm();
    this.checkOnlyView();
  }

  checkOnlyView(){
    if (this.key){
      this.isOnlyView = true;
      this.isLookingForHelp = true;
    }
  }

  buildForm(): void{
    this.form = this.formBuilder.group({
      issue: this.formBuilder.control('', Validators.required),
      documentType: this.formBuilder.control(null, Validators.required),
      description: this.formBuilder.control(null, Validators.required),
    });

    if (this.key){
      this.loadDocumentForm();
    }
  }

  loadDocumentForm(){
    const _key = this.key;
    this.dbProvider.documentDataObject(_key).valueChanges()
      .subscribe((res: any)=>{
        console.log("imprimiendo reporte a mirar")
        console.log(res)
        this.form.patchValue(res);
        this.oldImageUrl = res.imgUrl;
        this.imageAnalysis = res.details;
        this._geoAnswer = res.latLng;
        this.translateText();
      },err=>{
        console.log("Error al conseguir el document data object");
      })
  }

  onSubmit(): void {

    let loading = this.loadingProvider.createLoading();
    loading.present();
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);

    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
      // Save pet
      this.urlToDownload = snapshot.downloadURL;
      this.dbProvider
        .createDocument(
          this.issue.value,
          this.documentType.value,
          this.description.value,
          this.urlToDownload,
          this._geoAnswer,
          this.imageAnalysis
        ).then((res)=>{
        loading.dismiss()
        this.textDebug = res;
        this.checkIsLookingForkHelp()

      })
    });
  }

  checkIsLookingForkHelp(){
    if (this.documentType.value == 'Abandono' || this.documentType.value == 'Perdida') {
      this.isLookingForHelp = true;
    }
  }

  capture() {
    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;

      // Analize image
      this.isAnalizing = true;
      this.isAnalizingMessage = 'Estamos analizando la imagen...';
      this.subApi = this.apiProvider.analyseImgBase64(imageData)
      .subscribe(res=>{
        this.imageAnalysis = res;
        this.isAnalizing = false;
        this.translateText();
      },err=>{
        this.isAnalizing = false;
        alert("Hubo un error analizando la imagen")
      })
    }, (err) => {
      // Handle error
    });
  }

  openHelpFindPage(){
    let params = {
      documentType: this.documentType.value,
      metadata: this.imageAnalysis
    };
    this.navCtrl.push(HelpFindPage, params)
  }

  translateText(){
    this.isAnalizing = true;
    this.isAnalizingMessage = 'Estamos traduciendo la información';
    let text: string = '';
    this.imageAnalysis.responses.forEach(analisisType => {
      analisisType.labelAnnotations.forEach(annotation => {
        text+=annotation.description+', ';
      });
    });
    text = text.slice(0, -2);
    text+='.';
    this.apiProvider.translateFromEnglishToSpanish(text)
    .subscribe((res: any)=>{
      this.isAnalizing = false;
      let translations = res.data.translations;
      this.imageAnalisisTransalted = '';
      translations.forEach(element => {
        this.imageAnalisisTransalted+=element.translatedText;
      });


      this.imageAnalisisTransalted = this.imageAnalisisTransalted.replace('.',",");
      this.imageAnalisisTransalted = this.imageAnalisisTransalted.replace('"',"");
      this.imageAnalisisTransalted = this.imageAnalisisTransalted.replace(' ',"");
      this.imageAnalisisTransalted = this.imageAnalisisTransalted.replace(' ',"");
      this.imageAnalisisTransalted = this.imageAnalisisTransalted.split(",");

    }, err => {
      this.isAnalizing = false;
      alert("Hubo un error en la traducción")
    });

  }

  loadMap(){
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904, // default location
          lng: -89.3809802 // default location
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        // Now you can use all methods safely.
        if (this.key) {
          this.addReportLocation()
        }else {
          this.getPosition();
        }

      })
      .catch(error =>{
        console.log(error);
      });
  }

  addReportLocation() {
    this.map.moveCamera({
      target: this._geoAnswer
    });
    this.map.addMarker({
      title: 'Aquí se hizo el reporte',
      icon: 'green',
      animation: 'DROP',
      position: this._geoAnswer
    });
  }

  getPosition(): void{
    this.map.getMyLocation()
      .then(response => {
        this._geoAnswer = response.latLng;
        this.map.moveCamera({
          target: response.latLng
        });
        this.map.addMarker({
          title: 'My Position',
          icon: 'blue',
          animation: 'DROP',
          position: response.latLng
        });
      })
      .catch(error =>{
        console.log(error);
      });
  }

  get issue() { return this.form.get('issue') }
  get documentType() { return this.form.get('documentType') }
  get description() { return this.form.get('description') }



}
