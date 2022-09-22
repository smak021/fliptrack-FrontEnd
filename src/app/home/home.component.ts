import { Component, HostListener, OnInit, Type } from '@angular/core';
import { async } from '@firebase/util';
import { Observable,map, merge, debounceTime, distinctUntilChanged} from 'rxjs';
import { RestapiService } from '../restapi.service';
import {Data} from '../track/track.component'
export interface Film{
  film_id: string;
  film_name:string;
  full_name:string;
  film_genre:string;
  release_date:string;
  cast_n_crew:any;
  cover_url:string;
  dateDiff:number;
  top:number;
  film_status:string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  is_result = "none"
  spinner_diameter = 100;
  totalcols:number=10;
  topfive!:Data[]
  cols:number = 5;
  rows:number = 3;

  // post_copy!:Observable<Film[]>;
  post_copy !:Film[]
  films !:Film[];
  // films!:Observable<Film[]>;
  errorMessage!: string;
  title = 'scrap-view';
  items : string[] = [];
  interval!: any;
  constructor(private restapiservice: RestapiService) { }

  ngOnInit(): void {
    this.resposive();
    
    //  this.restapiservice.topweek(1).subscribe(async (it:any)=>{
    //   this.topfive = it['toptotal']
    //   console.log(this.topfive);
      this.readFilms()
    // })
    
    
  }

  findDiff(reldate:string){
    const date1 = new Date(reldate);
    const today = new Date();
    let diffTime:any = (date1.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays
  }

  readFilms() {
    this.restapiservice.getAllFilms().subscribe( (itt)=>{

      itt.forEach(item=>{
        // item.top = 0
        // this.topfive.forEach((val,index)=>{
        //   if(val.film_id == item.film_id)
        //   {
        //     item.top = index+1;
        //   }
        // })
        let dateSplit = item.release_date.split('-')
        item.dateDiff=this.findDiff(dateSplit[1]+'/'+dateSplit[2]+'/'+dateSplit[0])
        let month_digit=parseInt(dateSplit[1])
        let month=["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"][month_digit-1];
        item.release_date=[dateSplit[2],month,dateSplit[0]].join(" ");
      })
      this.films = itt
      this.post_copy = itt;
      // return itt
    })
   }

  resposive()
  {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    
    
    if(width>900)
    {
      
      // this.totalcols=20;
      this.cols = 5;
      // this.rows = 4;
    }
    else
    if(width<=900 && width>500)
    {
      // this.totalcols = 6;
      this.cols = 3;
      // this.rows = 3;
      this.spinner_diameter = 50;
    }
    else if(width<=500 && width >300){

      // this.totalcols = 4;
      this.cols = 2;
      // this.rows = 3;
      this.spinner_diameter = 50;
    }
    else if(width<=300)
    {

      // this.totalcols = 2
      this.cols = 1;
      // this.rows = 3;
    }
    
  }

  chechBox(filterYr: any){
    
    let checkBox = document.getElementById("year") as HTMLInputElement
    let checkBx2 = document.getElementById("year2") as HTMLInputElement
    let checkBx3 = document.getElementById("year3") as HTMLInputElement
    if(checkBox.checked || checkBx2.checked || checkBx3.checked)
    {
      // this.refreshData(filterYr)
    }
    else{
      // this.refreshData()
    }
  }


  
  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    
    this.isSticky = window.pageYOffset >= 50;
  }

  search=()=>{
    return 
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.films = this.post_copy.filter(r=>{
      return r.full_name.toLowerCase()
     .match(filterValue) || r.release_date.match(filterValue) 
     || r.film_genre.toLowerCase().match(filterValue)
      ||JSON.parse(r.cast_n_crew).actors[0].toLowerCase().match(filterValue)||
      JSON.parse(r.cast_n_crew).actors[1].toLowerCase().match(filterValue)||
      JSON.parse(r.cast_n_crew).crews[0].toLowerCase().match(filterValue)
    
    //  console.log(r);
    }) 
    console.log(this.films);
    if(this.films.length == 0)
    {
      this.is_result = "inherit"
    }
    else{
      this.is_result = "none"
    }
  
  }

  dateFormat(date: any, needDay:boolean, isReleaseDate:boolean)
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


}


