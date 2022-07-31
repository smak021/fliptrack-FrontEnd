import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable,map, single } from 'rxjs';
import { RestapiService } from '../restapi.service';
export interface SingleFilm{
  data_id:any;
  show:any;
  theatre:any;
  show_id:any;
  show_category_name:any;
  film:any;
  film_id:any;
  film_name:any;
  cover_url:any;
  release_date:any;
  film_story:any;
  film_genre:any;
  film_censor:any;
  film_duration:any;
  show_time:any;
  isWeekend:boolean;
  screen_name:any;
  is_blocked_covidseat:any;
  is_covidtime:any;
  show_date:any;
  price:any;
  booked_seats:any;
  available_seats:any;
  total_seats:any;
  last_modified:any;
  showCount:any;
}
@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {
panelOpenState = false;
//film details variables
name:string = '';release_date:string='';image_url:string='';
film_genre!:string;film_length!:string;film_story!:string;film_censor!:string;show!:Array<string>
//track details variables
displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
arr:string[]=[];
total:any;

singles={};
views:number=0;
public film !: any;
dd:any=0;
isWeekend:boolean = false;
show_date!:string;
singlefilm!:Observable<SingleFilm[]>;
url:string="../../assets/logo.png";
  constructor(private route: ActivatedRoute,private http: HttpClient,private restapiservice: RestapiService) { }

  ngOnInit(): void {
    this.film = this.route.snapshot.paramMap.get('id');
    this.singlefilm = this.restapiservice.getCompleteFilm(this.film).pipe(map(films=>{
      const cover:any = "cover_url";
      const duration:any = "film_duration";
      const genre:any = "film_genre";
      const story:any = "film_story";
      const censor:any = "film_censor";
      //header data
      this.name=films["full_name"];
      this.release_date=dateFormat(films["release_date"],false,true);
      this.image_url=films[cover].toString()
      //console.log(this.image_url);
      this.film_length = films[duration].toString()
      this.film_genre=films[genre].toString()
      this.film_story=films[story].toString()
      this.film_censor="("+films[censor]+")";
      //this.film_length=='Not Available' ? this.film_length="Duration Not Available": "";
      this.film_censor=='(Not Available)' ? this.film_censor=" ": "";
      this.film_genre=='Not Available' ? this.film_genre=" ": "";
      this.film_story=='Not Available' ? this.film_story="Story not available": "";

      //Main data 
      let arr: any[]=[];
      let fetchData:any={};
      let showsArray:any[]=[];
      let booked_seats=0;
      let bprice =0;
      let total_seats=0;
      let available_seats=0;
      let showsCount =0;
      let id;
      let size:number = Object.keys(films).length
      const show:any = "show"
      let date;
      let shows = films[show]
      for (const key in shows) {

        id = shows[key].show_date;
        let showid = shows[key].show_id;
        let theatreCode = shows[key].theatre_code;
        let showTheatre = showid+theatreCode;
        
        
        date = dateFormat(id,true,false);
        if(date[2]==0 || date[2]== 6){
          this.isWeekend = true;
        }
        else{
          this.isWeekend = false;
        }
        console.log("showsID:",showTheatre);
        
        if(fetchData[id]==null)
        {
          
          console.log("day",date[2]);
          booked_seats =0, total_seats =0, bprice =0, available_seats =0; showsCount =0;
          while(showsArray.length>0){
            showsArray.pop();
          }
        }
        if(!showsArray.includes(showTheatre))
        {
          
          showsArray.push(showTheatre)
        }
        showsCount = showsArray.length;
        booked_seats += parseInt(shows[key].booked_seats);
        total_seats += parseInt(shows[key].total_seats);
        bprice += parseInt(shows[key].booked_seats) * parseInt(shows[key].price);
        available_seats += parseInt(shows[key].available_seats);
        const element2 = shows[key];
        this.dd += parseInt(shows[key].booked_seats) * parseInt(shows[key].price);
        fetchData[id] = {"show_date":date[1]+", "+date[0],"showCount":showsCount,"booked_seats":booked_seats,"total_seats":total_seats, "available seats":available_seats,"price": bprice,"isWeekend":this.isWeekend }      
        
      }
     
      
      for( let i in fetchData)
      {
        arr.push(fetchData[i]);
      }
      return arr;
    }
      ))      
      
      
    function dateFormat(date: any, needDay:boolean, isReleaseDate:boolean)
    {
      let d:any, day:any, month_digit:any, month:any, year:any;
      if(isReleaseDate){
      d=date.split("-");
      // date = d[2]
      day = d[2]
      year = d[0];
      month_digit=parseInt(d[1])-1;
      }
      else{
      d=date.split("");
      day = [d[6],d[7]].join("")
      year = [d[0],d[1],d[2],d[3]].join("");
      month_digit=parseInt([d[4],d[5]].join(""))-1;
      }
      month=["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"][month_digit];
      date=[day,month,year].join(" ");
      if(needDay)
      {
      let dy = new Date(year,month_digit,day); 
      var dayC=["Sun", "Mon", "Tue", "Wed", "Thu", "Fri",
      "Sat"][dy.getDay()];
      let newArr=[];
      newArr.push(date);
      newArr.push(dayC);
      newArr.push(dy.getDay())
      return newArr;
      }else{
        return date;
      }
    }

    //window.scroll(0,0);


    

  }

  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 250;
  }

}

