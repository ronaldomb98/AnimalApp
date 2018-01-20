
import {Injectable, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from "angularfire2/database";
import {IUserData} from "../../models/models";
import {AuthProvider} from "../auth/auth";

import {LatLng} from "@ionic-native/google-maps";

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {
  userDataRef: AngularFireObject<IUserData>;
  usersList: AngularFireObject<any[]>;
  constructor(
    public db: AngularFireDatabase,
    private authProvider: AuthProvider

  ) { }

  createUserData(userData: IUserData) {
    const _uid = this.authProvider.currentUserUid;
    this.userDataRef = this.db.object('users-data/' + _uid )
    return this.userDataRef.set(userData);
  }

  createPet(name, urlImg, description, petType,vaccines, details, isSterilized, characteristics = '') {
    const petList = this.petList;
    return petList.push(
      {
        name: name,
        description: description,
        petType: petType,
        isSterilized: isSterilized,
        characteristics: characteristics,
        vaccines: vaccines,
        details: details,
        urlImg: urlImg,
        userId: this.authProvider.currentUserUid
      }
    )
  }

  listDocumentType() {
    return this.db.list('document-type').valueChanges()
  }


  createDocument(issue: string, documentType: string, description, imgUrl: string, latLng: LatLng, details) {
    const _document = {
      issue: issue,
      documentType: documentType,
      description: description,
      createdBy: this.authProvider.currentUserUid,
      createdOn: new Date().getTime(),
      isAuthorized: false,
      imgUrl: imgUrl,
      latLng: latLng,
      details: details
    };
    let list =  this.documentList;
    return list.push(_document);

  }

  get documentList() { return this.db.list('documents') }
  get petList() { return this.db.list('pets') }
  get myDocumentList() {
    const _uid: string = this.authProvider.currentUserUid;
    return this.db
      .list(
        'documents'
        , ref =>
          ref.orderByChild('createdBy')
            .equalTo(_uid)
      );
  }

  get myPetList() {
    const _uid: string = this.authProvider.currentUserUid;
    return this.db
      .list(
        'pets'
        , ref =>
          ref.orderByChild('userId')
            .equalTo(_uid)
      );
  }

  _myPetList() {
    const _uid: string = this.authProvider.currentUserUid;
    return this.db
      .list(
        'pets'
        , ref =>
          ref.orderByChild('userId')
            .equalTo(_uid)
      );
  }

  userDataObject(uid?) {
    const _uid: string = uid ? uid : this.authProvider.currentUserUid;
    return this.db.object('users-data/' + _uid );
  }

  petDataObject(key) {
    return this.db.object('pets/' + key );
  }

  documentDataObject(key) {
    return this.db.object('documents/' + key );
  }

  public updateUserData(data
  ) {
    /* const data = {
      address: address,
      city: city,
      mobilePhone: mobilePhone,
      name: name,
      phone: phone,
      surname: surname
    }; */
    this.authProvider.isUpdatingUserInfo= true;
    return this.userDataObject().update(data).then(()=> this.authProvider.isUpdatingUserInfo= false);
  }

  public updatePetData(key, data) {
    return this.petDataObject(key).update(data);
  }

  public documentListByType(documentType) {
    return this.db.list(
      'documents',
      ref => ref.orderByChild('documentType').equalTo(documentType)
    )
  }

  public closeReferences(){

  }

}
