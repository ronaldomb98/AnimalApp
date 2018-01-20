import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  public news = [];
  constructor(
    public navCtrl: NavController,
    public angularFireAuth: AngularFireAuth
  ) {

  }

  ngOnInit(){
    this.news = [
      {
        title: "Noticia 1",
        img: "http://www.diagramconsultores.com/wp-content/uploads/2011/06/07-06-201A.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias atque distinctio facilis obcaecati suscipit tenetur totam! Amet atque minima, molestiae officiis quaerat quod reprehenderit? Enim magni neque sequi vel?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias atque distinctio facilis obcaecati suscipit tenetur totam! Amet atque minima, molestiae officiis quaerat quod reprehenderit? Enim magni neque sequi vel?"
      },
      {
        title: "Noticia 2",
        img: "https://i.ytimg.com/vi/vVbBDI9LO90/maxresdefault.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias atque distinctio facilis obcaecati suscipit tenetur totam! Amet atque minima, molestiae officiis quaerat quod reprehenderit? Enim magni neque sequi vel?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias atque distinctio facilis obcaecati suscipit tenetur totam! Amet atque minima, molestiae officiis quaerat quod reprehenderit? Enim magni neque sequi vel?"
      },
      {
        title: "Noticia 3",
        img: "http://www.noalmaltratoanimal.org/images/cartelperros2.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias atque distinctio facilis obcaecati suscipit tenetur totam! Amet atque minima, molestiae officiis quaerat quod reprehenderit? Enim magni neque sequi vel?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias atque distinctio facilis obcaecati suscipit tenetur totam! Amet atque minima, molestiae officiis quaerat quod reprehenderit? Enim magni neque sequi vel?"
      },
      {
        title: "Noticia 4",
        img: "http://pravia.com.mx/wp-content/uploads/2014/09/Maltrato-Animal.png",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias atque distinctio facilis obcaecati suscipit tenetur totam! Amet atque minima, molestiae officiis quaerat quod reprehenderit? Enim magni neque sequi vel?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias atque distinctio facilis obcaecati suscipit tenetur totam! Amet atque minima, molestiae officiis quaerat quod reprehenderit? Enim magni neque sequi vel?"
      }
    ]
  }



}
