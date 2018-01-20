import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {
  private API_KEY: string = 'AIzaSyBT6x0W04yZClyjQ6xd1IU91IZV_3vh3kE';
  private baseVisionUrl: string = 'https://vision.googleapis.com/v1/images:annotate';
  private baseTemplateUrl: string = 'https://translation.googleapis.com/language/translate/v2';

  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }

  analyseImg(imgUrl) {
    let url: string = this.baseVisionUrl + '?key=' + this.API_KEY;
    let options = new HttpHeaders().set('Content-Type', 'application/json')
    const body = {
      "requests": [
        {
          "features": [
            {
              "type": "LABEL_DETECTION"
            }
          ],
          "image": {
            "source": {
              "imageUri": imgUrl
            }
          }
        }
      ]
    };
    return this.http.post(url, body)
  }

  analyseImgBase64(baseCode){
    let url: string = this.baseVisionUrl + '?key=' + this.API_KEY;
    let options = new HttpHeaders().set('Content-Type', 'application/json')
    const body = {
      "requests": [
        {
          "features": [
            {
              "type": "LABEL_DETECTION"
            }
          ],
          "image": {
            "content": baseCode
          }
        }
      ]
    };
    return this.http.post(url, body)
  }

  translateFromEnglishToSpanish(text: string) {
    let url: string = this.baseTemplateUrl + '?key=' + this.API_KEY;
    let options = new HttpHeaders().set('Content-Type', 'application/json')
    const body = {
      "q": text,
      "target": "es",
      "format": "text",
      "source": "en"
    };
    return this.http.post(url, body)
  }

}
