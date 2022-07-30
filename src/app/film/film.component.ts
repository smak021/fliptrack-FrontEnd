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
show_date!:string;
singlefilm!:Observable<SingleFilm[]>;
url:string="../../assets/logo.png";
  constructor(private route: ActivatedRoute,private http: HttpClient,private restapiservice: RestapiService) { }

  ngOnInit(): void {
    
    this.film = this.route.snapshot.paramMap.get('id');
    this.singlefilm = this.restapiservice.getCompleteFilm(this.film).pipe(map(films=>{
     const element:any = "film_name";
     const release_date:any = "release_date";
     const cover:any = "cover_url";
     const duration:any = "film_duration";
     const genre:any = "film_genre";
     const story:any = "film_story";
     const censor:any = "film_censor";
     //header data
      this.name=capitalizeFirstLetter(films[element]);
      var d=films[release_date].toString().split("");
      var month_digit=parseInt([d[5],d[6]].join(""))-1;
      var month=["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"][month_digit];
      this.release_date=[d[8],d[9],d[7],month,d[4],d[0],d[1],d[2],d[3]].join("").replace(/-/g,' ');
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
      let booked_seats=0;
      let bprice =0;
      let total_seats=0;
      let available_seats=0;
      let showsCount =0;
      let id;
      let size:number = Object.keys(films).length
      const show:any = "show"
      let shows = films[show]
      for (const key in shows) {

        id = shows[key].show_date;
        let a = id.split("");
        let year = parseInt([a[0],a[1],a[2],a[3]].join(""));
        let mnt = parseInt([a[4],a[5]].join(""))
        let dy = parseInt([a[6],a[7]].join(""))
        let day = new Date(year,mnt-1,dy); 
        var dayC=["Sun", "Mon", "Tue", "Wed", "Thu", "Fri",
        "Sat"][day.getDay()];
        console.log(dayC);
        let mValue = parseInt([a[4],a[5]].join(""))-1
        var month=["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"][mValue];
        let date = a[6]+a[7]+" "+month+" "+a[0]+a[1]+a[2]+a[3];
        if(fetchData[id]==null)
          {
            booked_seats =0, total_seats =0, bprice =0, available_seats =0; showsCount =0
          }
        showsCount += 1;
        booked_seats += parseInt(shows[key].booked_seats);
        total_seats += parseInt(shows[key].total_seats);
        bprice += parseInt(shows[key].booked_seats) * parseInt(shows[key].price);
        available_seats += parseInt(shows[key].available_seats);
        const element2 = shows[key]
        this.dd += parseInt(shows[key].booked_seats) * parseInt(shows[key].price);
        fetchData[id] = {"show_date":date+", "+dayC,"showCount":showsCount,"booked_seats":booked_seats,"total_seats":total_seats, "available seats":available_seats,"price": bprice }      

      }
      
      for( let i in fetchData)
      {
        arr.push(fetchData[i]);
      }
      return arr;
    }
      ))

      
      
      

/*
    this.singlefilm = this.restapiservice.getSingleFilm(this.film).pipe(
      map(films=>{ let size:any=Object.keys(films).length;
        Object.entries(films).map(tet=>{
          console.log(tet);
          
        })
        for(let i in films)
        {
          console.log(films[i].shows);
          
        }
        let single:any={};
        let arr=[];
        let bseats=0,tseat=0,amount=0;
        console.log("size",size);
        console.log("id",films);
       
        films.forEach(shows=>{

          //console.log(shows['film_id']);
          
        
          let datesubscript;
          let shdate=counts['show_date'];
          var d=shdate.split("");
          console.log(d);
          var month_digit=parseInt([d[4],d[5]].join(""))-1;
          console.log(month_digit);
          var month=["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"][month_digit];
          var datevalue=d[7];
          if(datevalue=='1' && d[6]!='1'){
            datesubscript='st';
          }
          else if(datevalue=='2' && d[6]!='1'){
            datesubscript='nd';
          }
          else if(datevalue == '3' && d[6]!='1')
          {
            datesubscript='rd';
          }
          else{
            datesubscript='th';
          }

          let date=[d[6],d[7],datesubscript,' ',month,' ',d[0],d[1],d[2],d[3]].join("").replace(/-/g,' ');
          
          
          if(single[date]!=null){
            bseats=bseats+parseInt(counts['booked_seat']);
            tseat=tseat+parseInt(counts['total_seat']);
            amount= amount + (parseFloat(counts['price'])*parseFloat(counts['booked_seat']));

          }
          else{
            bseats=Math.floor(parseFloat(counts['booked_seat']));
            tseat=parseInt(counts['total_seat']);
            amount= (parseFloat(counts['price'])*bseats);
          }
          let stramount= Math.floor(amount).toLocaleString('en-IN');
         
          
          single[date]={'show_date':date,'booked_seat':bseats,'total_seat': tseat, 'price': stramount};
          
        })
       
        for(let i in single){
        arr.push(single[i]);
        }
        
          
        return arr;
        
      })
    )
     */


    // this.http.get<any>('http://127.0.0.1:8000/getdata/'+this.film+'/').subscribe(fdata=>{
    //   for(let i in fdata){
    //   this.dd += (parseInt(fdata[i]['booked_seat'])*(fdata[i]['price'])); 
    // }
    // this.dd = Math.floor(this.dd).toLocaleString('en-IN');
    // });


    function capitalizeFirstLetter(string: any) {
      let value,new_value;
      new_value=string.replace(/-/g,' ');

      var splitStr = new_value.toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {

       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
      }
      value = splitStr.join(' '); 
      
      return value;
    }

    //window.scroll(0,0);

  }

  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 250;
  }

}

