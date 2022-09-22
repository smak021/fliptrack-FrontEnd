import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable,map, single } from 'rxjs';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { RestapiService } from '../restapi.service';
import { StringLike } from '@firebase/util';
import { percentage } from '@angular/fire/storage';

export interface SFilm{
  film_id:string;
  film_name:string;
  cover_url:string;
  release_date:string;
  film_story:string;
  film_genre:string;
  film_censor:string;
  film_duration:string;
  full_name:string;
  cast_n_crew:string;
}

export interface DataDate{
name:string;
date:string;
shows:string;
isWeekend:boolean;
isToday:boolean;
isHoliday:string;
booked_seats:any;
total_seats:any;
total_amount:any;
}

export interface DataTheatre{
name:string;
theatre_name:string;
show_count:string;
theatre_location:string;
booked_seats:string;
total_seats:string;
price:any;
}

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css'],
  animations:[
    trigger('animationOption2', [      
      transition(':enter', [
        style({ opacity:1 }),
        animate(300)
      ]),
      transition(':leave', [
        animate(300, style({ opacity:0 }))
      ]),
      state('*', style({opacity:1 })),
    ])
  ]
})
export class FilmComponent implements OnInit {
  


  // Chart

  public lineChartData!: ChartConfiguration<'line'>['data'] ;
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    locale:'en-In',
  };
  public lineChartLegend = true;

canvasWidth = 400
canvasHeight = 300
  // Chart END

tabs = "primary";
spinner_diameter = 100;
progressWidth:any;
// filmData!:Observable<SFilm[]>
filmData!:SFilm[]
// dateData!:Observable<DataDate[]>;
dateData!:DataDate[];
dateDateCopy!:Observable<DataDate[]>;
// theatredata!:Observable<DataTheatre[]>;
theatredata!:DataTheatre[];
panelOpenState = false;
//film details variables
name:string = '';release_date:string='';image_url:string='';castncrew:any;jsonCast:any;
film_genre!:string;film_length!:string;film_story!:string;film_censor!:string;show!:Array<string>
//track details variables
//totals
total_shows=0;
total_seats=0;
booked_seats=0;
displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
arr:string[]=[];
total:any;
is_theatre = 'inherit';
total_percentage:string='...';
total_days=0;
show_last_modified:any;
views:number=0;
public film !: any;
dd:any=0;
ddN:any='...';
isWeekend:boolean = false;
show_date!:string;

url:string="../../assets/logo.png";
  activatedRoute: any;

constructor(private route: ActivatedRoute,private http: HttpClient,private restapiservice: RestapiService) { }

ngOnInit(): void {

  

  this.film = this.route.snapshot.paramMap.get('id');
  let loc:any = {
    "KOZH":"Kozhikode",
    "WAYA":"Wayanad",
    "THSR":"Thrissur",
    "KOCH":"Kochi",
    "TRIV":"Trivandrum",
    "KOLM":"Kollam",
    "ALPZ":"Alappuzha",
    "IDKI":"Idukki",
    "HRPD":"Haripad",
    "THAL":"Thalayolaparambu",
    "KASA":"Kasaragod",
    "IRNK":"Irinjalakuda"
  }
  this.restapiservice.getDatabyTheatre(this.film).subscribe((itt)=>{


    itt.forEach(it=>{
      let ss= it.theatre_location
      if(loc[ss]!=null){
        it.theatre_location = loc[ss]
      }
    })
    // let val =  Object.values(itt)
    // console.log(val);
    this.theatredata=itt
    // this.is_theatre='none'
  })

  this.restapiservice.getSingleFilm(this.film).subscribe(itt=>{
  for (const key of itt) {
    this.name = key.full_name
    this.film_story = key.film_story
    this.film_genre = key.film_genre
    this.image_url = key.cover_url
    this.film_censor = "("+key.film_censor+")"
    this.film_length = key.film_duration
    this.release_date = key.release_date
  }
  this.filmData = itt
    // return itt
  })

  this.restapiservice.getDatabyDate(this.film).subscribe((itt)=>{
    let total_price=0;
    let chart_data:(number | null)[]=[];
    let chart_label:(number | null)[]=[];
    for (const key in itt) {
      this.total_days += 1;
      chart_data.push(parseInt(itt[key].total_amount))
      this.total_shows += parseInt(itt[key].shows)
      this.booked_seats += parseInt(itt[key].booked_seats)
      this.total_seats += parseInt(itt[key].total_seats)
      this.dd += parseInt(itt[key].total_amount)
      let date = dateFormat(itt[key].date,true,false);
      let today = new Date()
      let date_for = new Date(date[0])

      if(date_for.setHours(0,0,0,0)==today.setHours(0,0,0,0))
      {        
        itt[key].isToday = true
      }
      else{
        itt[key].isToday = false
      }
      itt[key].date = date[1]+', '+date[0]
      chart_label.push(date[0].slice(0,6))
      if(date[2]==0)
      {
        itt[key].isHoliday = 'Holiday'
      }
      if(date[2]== 5 ||date[2]== 6 ||date[2]== 0)
      {
        itt[key].isWeekend = true
      }
    }

    

    this.lineChartData= {
      labels: chart_label,
      datasets: [
        {
          pointRadius:4,
          data: chart_data,
          label: 'Amount',
          fill: true,
          clip:5,
          tension: 0.5,
          borderColor: 'white',
          backgroundColor: 'rgba(119, 83, 204, 0.8)'
        }
      ]
    };
    
    
    this.total_percentage = (this.booked_seats/this.total_seats*100).toFixed(2)+"%"
    let nlength = this.dd.toString().length
    if(this.dd.toString().length == 6 ||this.dd.toString().length == 7)
        {
          this.ddN ="₹ "+this.dd.toString().slice(0,nlength-5)+"."+this.dd.toString().slice(nlength-5,nlength-3)+"L";
        }
        else
        if(this.dd.toString().length >= 8)
        {
          this.ddN = "₹ "+this.dd.toString().slice(0,nlength-7)+"."+this.dd.toString().slice(nlength-7,nlength-5)+"Cr";
        }
        else{
          this.ddN ="₹ "+(this.dd.toLocaleString('en-IN'));
        }
    this.dateData = Object.values(itt);
    
    // return val;
  })





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
      month=["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month_digit];
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

  // isSticky: boolean = false;

  // @HostListener('window:scroll', ['$event'])
  // checkScroll() {
  //   this.isSticky = window.pageYOffset >= 250;
  // }

}
}
