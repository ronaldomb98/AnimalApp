import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Camera, CameraOptions} from "@ionic-native/camera";
import * as firebase from 'firebase';
import {DbProvider} from "../../providers/db/db";
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
export class PetPage {
  public urlToDownload;
  ionViewDidLoad() {
    console.log('ionViewDidLoad PetPage');
  }

  form: FormGroup;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private dbProvider: DbProvider
  ) {

  }

  ngOnInit(): void {
    this.buildForm()
    this.captureDataUrl = null;
  }

  buildForm(): void{
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      description: this.formBuilder.control(null, Validators.required),
      characteristics: this.formBuilder.control(null),
      petType: this.formBuilder.control('dog', Validators.required),
      isSterilized: this.formBuilder.control(false, Validators.required)
    })
  }

  onDevelopment(){
    alert('En Desarrollo')
  }

  captureDataUrl: string;

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
    }, (err) => {
      // Handle error
    });
  }

  upload() {
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
        this.isSterilized.value,
        this.characteristics.value
      ).then(()=>{
        this.navCtrl.pop();
      })
    });

  }
  get name()            { return this.form.get('name') }
  get description()     { return this.form.get('description') }
  get petType()     { return this.form.get('petType') }
  get isSterilized()     { return this.form.get('isSterilized') }
  get characteristics() { return this.form.get('characteristics') }

}
