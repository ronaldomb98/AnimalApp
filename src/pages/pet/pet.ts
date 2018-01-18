import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad PetPage');
  }

  form: FormGroup;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm(): void{
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('',[
        Validators.required
      ])
    })
  }

  onDevelopment(){
    alert('En Desarrollo')
  }

  get name() { return this.form.get('name') }

}
