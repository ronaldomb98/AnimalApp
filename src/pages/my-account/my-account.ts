import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthProvider} from "../../providers/auth/auth";
import {IUserData} from "../../models/models";
import {DbProvider} from "../../providers/db/db";
import {AngularFireObject} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import { LoadingProvider } from '../../providers/loading/loading';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the MyAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {

  form: FormGroup;
  sub: Subscription;
  key: string;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    private dbProvider: DbProvider,
    private loadingProvider: LoadingProvider,
    public viewCtrl: ViewController
  ) {

  }

  ngOnInit(): void {
    this.key = this.navParams.get('key');
    this.buildForm();
  }

  ionViewDidLoad() {

  }

  ionViewWillUnload() {
    this.sub.unsubscribe();
  }

  private buildForm(): void{
    
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('',Validators.required),
      surname: this.formBuilder.control('',Validators.required),
      address: this.formBuilder.control('',Validators.required),
      city: this.formBuilder.control('',Validators.required),
      phone: this.formBuilder.control('',Validators.required),
      mobilePhone: this.formBuilder.control('',Validators.required),
    });

    this.loadUserData();
  }

  private loadUserData(): void {
    const loading = this.loadingProvider.createLoading();
    loading.present();
    let userdata = this.dbProvider.userDataObject(this.key);
    this.sub = userdata.valueChanges().subscribe(res=>{
      this.form.patchValue(res)
      loading.dismiss();
    })  
  
  }

  public onSubmit():void {
    const loading = this.loadingProvider.createLoading();
    loading.present();
    const userData: IUserData = this.form.value;
    this.dbProvider.updateUserData(userData).then(()=>{
      loading.dismiss();
      const toast = this.loadingProvider.createUpdatedToast();
      toast.present();
    });
  }

  public closeModal(){
    this.viewCtrl.dismiss();
  }

  get name()        { return this.form.get('name') }
  get surname()     { return this.form.get('surname') }
  get address()     { return this.form.get('address') }
  get city()        { return this.form.get('city') }
  get phone()       { return this.form.get('phone') }
  get mobilePhone() { return this.form.get('mobilePhone') }


}
