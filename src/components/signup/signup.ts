import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the SignupComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'signup',
  templateUrl: 'signup.html'
})
export class SignupComponent implements OnInit{

  text: string;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authProvider: AuthProvider
  ) {
    console.log('Hello SignupComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm(): void{
    this.form = this.formBuilder.group({
      email: this.formBuilder.control(null,[
        Validators.required,
        Validators.email
      ]),
      password1: this.formBuilder.control(null,[
        Validators.required,
        Validators.minLength(6)
      ]),
      password2: this.formBuilder.control(null,Validators.required)
    })
  }

  public signup() {
    this.authProvider.basicSignup(this.email.value, this.password1.value)
      .then(res=>{
        console.log(res)
      });
  }

  get email() { return this.form.get('email') }
  get password1(){ return this.form.get('password1') }
  get password2(){ return this.form.get('password2') }

}
