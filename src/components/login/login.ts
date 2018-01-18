import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the LoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider
  ) {

  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm(): void{
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('test1@gmail.com',[
        Validators.required, Validators.email
      ]),
      password1: this.formBuilder.control('ronaldo123123',[Validators.required]),

    })
  }

  public login() {
    this.authProvider.basicLogin(this.email.value, this.password1.value)
      .then(res=>{
        console.log(res)
      });
  }

  get email() { return this.form.get('email') }
  get password1(){ return this.form.get('password1') }

}
