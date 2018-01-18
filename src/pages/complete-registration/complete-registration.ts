import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthProvider} from "../../providers/auth/auth";
import {IUserData} from "../../models/models";
import {DbProvider} from "../../providers/db/db";
import {Subscription} from "rxjs/Subscription";

/**
 * Generated class for the CompleteRegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-complete-registration',
  templateUrl: 'complete-registration.html',
})
export class CompleteRegistrationPage {
  userDataSub: Subscription;
  ionViewDidLoad() {
    console.log('ionViewDidLoad CompleteRegistrationPage');
  }

  form: FormGroup;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider,
    private dbProvider: DbProvider
  ) {

  }

  ngOnInit(): void {
    this.buildForm()
    console.log(this.authProvider.currentUserUid)

  }

  ionViewWillUnload() {

  }

  buildForm(): void{
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('test1',Validators.required),
      surname: this.formBuilder.control('test1',Validators.required),
      address: this.formBuilder.control('test1',Validators.required),
      city: this.formBuilder.control('test1',Validators.required),
      phone: this.formBuilder.control('test1',Validators.required),
      mobilePhone: this.formBuilder.control('test1',Validators.required),
    })
  }

  public onSubmit() {
    const userData: IUserData = this.form.value;
    this.dbProvider.createUserData(userData);
  }

  get name()        { return this.form.get('name') }
  get surname()     { return this.form.get('surname') }
  get address()     { return this.form.get('address') }
  get city()        { return this.form.get('city') }
  get phone()       { return this.form.get('phone') }
  get mobilePhone() { return this.form.get('mobilePhone') }


}
