import {Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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


  public form: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void{
    this.form = this.formBuilder.group({
      label: this.formBuilder.control('', Validators.required),
      documentType: this.formBuilder.control(null, Validators.required),
      description: this.formBuilder.control(null, Validators.required),
    })
  }

  onSubmit(): void {

  }

  get label() { return this.form.get('label') }
  get documentType() { return this.form.get('documentType') }
  get description() { return this.form.get('description') }


}
