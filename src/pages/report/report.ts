import {Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FirebaseListObservable} from "angularfire2/database-deprecated";
import {DbProvider} from "../../providers/db/db";
import {Observable} from "rxjs/Observable";

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

  captureDataUrl: string;
  documentTypeList: Observable<any[]>;
  public form: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private camera: Camera,
    private dbProvider: DbProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
  }

  ngOnInit(): void {
    this.buildForm();
    this.documentTypeList = this.dbProvider.listDocumentType();
  }

  buildForm(): void{
    this.form = this.formBuilder.group({
      issue: this.formBuilder.control('', Validators.required),
      documentType: this.formBuilder.control(null, Validators.required),
      description: this.formBuilder.control(null, Validators.required),
    })
  }

  onSubmit(): void {

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
    }, (err) => {
      // Handle error
    });
  }

  get issue() { return this.form.get('issue') }
  get documentType() { return this.form.get('documentType') }
  get description() { return this.form.get('description') }


}
