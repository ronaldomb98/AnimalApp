import {Component, OnDestroy} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Camera, CameraOptions} from "@ionic-native/camera";
import * as firebase from 'firebase';
import {DbProvider} from "../../providers/db/db";
import {LoadingProvider} from "../../providers/loading/loading";
import { FormArray } from '@angular/forms/src/model';
import {Subscription} from "rxjs/Subscription";
import {IUserData} from "../../models/models";
import { ApiProvider } from '../../providers/api/api';
/**
 * Generated class for the PetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pet',
  templateUrl: 'pet.html',
})
export class PetPage implements OnDestroy{
  public urlToDownload;
  public key;
  private sub: Subscription;
  private subApi: Subscription;
  private subApiTranslate:Subscription;
  private oldImage;
  captureDataUrl: string;
  form: FormGroup;
  private isAnalizing: boolean = false;
  private isAnalizingMessage: string = '';
  private imageAnalysis;
  private textDebug; // To delete
  private imageAnalisisTransalted: any;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private dbProvider: DbProvider,
    private loadingProvider: LoadingProvider,
    private apiProvider: ApiProvider
  ) {

  }

  ngOnInit(): void {
    this.key = this.navParams.get('key');
    this.buildForm();
    this.subApi = new Subscription();
    this.subApiTranslate = new Subscription();
    this.captureDataUrl = null;
  }

  ngOnDestroy() {
    if (this.key) {
      this.sub.unsubscribe();
    }
    this.subApi.unsubscribe();
    this.subApiTranslate.unsubscribe();
  }

  ionViewWillLeave() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PetPage');
  }

  buildForm(): void{
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      description: this.formBuilder.control(null, Validators.required),
      characteristics: this.formBuilder.control(null),
      petType: this.formBuilder.control('dog', Validators.required),
      isSterilized: this.formBuilder.control(false, Validators.required),
      vaccines: this.formBuilder.array([])
    });

    if (this.key){
      this.loadPetData();
    }
  }

  private loadPetData(): void {
    const loading = this.loadingProvider.createLoading();
    const key = this.key;
    loading.present();

    let pet = this.dbProvider.petDataObject(key);
    this.sub = pet.valueChanges().subscribe((res: any)=>{
      this.form.patchValue(res)
      this.oldImage = res.urlImg;
      if (res && res.vaccines) {
        let vaccines = res.vaccines;
        vaccines.forEach(_vaccine=>{
          console.log(_vaccine)
          this.addVaccine(_vaccine)
        })
      }

      loading.dismiss();
    })

  }

  addVaccine(vaccine?) {
    this.vaccines.push(this.formBuilder.group({
      name: this.formBuilder.control(vaccine ? vaccine.name : '', Validators.required),
       dateApplied: this.formBuilder.control(vaccine ? vaccine.dateApplied: '', Validators.required)
    }))
  }

  deleteVaccine(i) {
    this.vaccines.removeAt(i);
  }

  onDevelopment(){
    alert('En Desarrollo')
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
    this.subApiTranslate = this.apiProvider.translateFromEnglishToSpanish(text)
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

  upload() {

    if (this.key){
      this.updatePetDate();
      return
    }
    // Create loading
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

      this.dbProvider.createPet(
        this.name.value,
        this.urlToDownload,
        this.description.value,
        this.petType.value,
        this.vaccines.value,
        this.imageAnalysis,
        this.isSterilized.value,
        this.characteristics.value
      ).then(()=>{
        this.navCtrl.pop().then(()=> loading.dismiss());
      })


    });
  }


  updatePetDate(){
    const pet = this.form.value;
    const key = this.key;
    this.dbProvider.updatePetData(key,pet).then(()=>{
      const toast = this.loadingProvider.createUpdatedToast();
      toast.present();
      this.navCtrl.pop();
    });
  }


  get name()            { return this.form.get('name') }
  get description()     { return this.form.get('description') }
  get petType()     { return this.form.get('petType') }
  get isSterilized()     { return this.form.get('isSterilized') }
  get characteristics() { return this.form.get('characteristics') }
  get vaccines(): FormArray { return this.form.get('vaccines') as FormArray }

}
