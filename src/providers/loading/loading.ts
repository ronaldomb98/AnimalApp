import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LoadingController} from "ionic-angular";

/*
  Generated class for the LoadingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingProvider {

  constructor(public loadingController: LoadingController) {
    console.log('Hello LoadingProvider Provider');
  }

  createLoading(){
    return this.loadingController.create({content:'Cargando...', spinner: 'dots'})
  }

}
