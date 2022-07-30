import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { fadeAnimation } from './animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations:[fadeAnimation]
})
export class AppComponent implements OnInit {
  title = 'scrap-view';
  items : string[] = [];
  release_date : string[] =[];
  film_code :string[]=[] ;
  image_url : string[] =[];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    function capitalizeFirstLetter(string: string) {
      let value,new_value;
      new_value=string.replace(/-/g,' ');

      var splitStr = new_value.toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {

       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
      }
      value = splitStr.join(' '); 
      
      return value;

      return string.charAt(0).toUpperCase() + string.slice(1);
    }


      // this.http.get<any>('http://127.0.0.1:8000/api/films/').toPromise().then(data=> {
      //   for(let key in data)
      //   {
      //     if(data.hasOwnProperty(key))
      //     {
      //       let current_film = capitalizeFirstLetter(data[key]['film_name'])
           
      //       if(!this.items.includes(current_film))
      //       {
      //         this.items.push(current_film);
      //         this.film_code.push(data[key]['film_id']);
      //         this.release_date.push(data[key]['release_date']);
      //         this.image_url.push(data[key]['cover_url']);
      //      }
      //     }
      //   }
      // })
  }

  onActivate(event:any) {
    // window.scroll(0,0);
 
    window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
     });
 
     //or document.body.scrollTop = 0;
     //or document.querySelector('body').scrollTo(0,0)
 }
  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 250;
  }


}
export class CardFancyExample {}


