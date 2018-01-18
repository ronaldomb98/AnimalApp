import { HttpClient } from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from "angularfire2/database";
import {IUserData} from "../../models/models";
import {AuthProvider} from "../auth/auth";

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider implements OnInit{
  userDataRef: AngularFireObject<IUserData>;
  usersList: AngularFireObject<any[]>;
  constructor(
    public db: AngularFireDatabase,
    private authProvider: AuthProvider
  ) {
  }

  ngOnInit() {

  }

  createUserData(userData: IUserData) {
    this.userDataRef = this.db.object('users-data/' +  this.authProvider.currentUserUid)
    return this.userDataRef.set(userData);
  }

}
