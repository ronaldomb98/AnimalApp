export interface IUserData {
  $key?: string;
  name: string;
  surname: string;
  address: string;
  city: string;
  phone: string;
}

export interface IPet {
  $key?: string;
  name: string;
  bornDate: string;
  vaccines?: IPetVaccine[];
  photo: any;
}

export interface IPetVaccine {
  $key?: string;
  name: string;
  applicationDay: string;
}


