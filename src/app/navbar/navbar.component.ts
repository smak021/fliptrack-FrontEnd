import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { RestapiService } from '../restapi.service';

export interface Film{
  film_id: string;
  film_name:string;
  full_name:string;
  film_genre:string;
  release_date:string;
  cast_n_crew:any;
  cover_url:string;
  film_status:string;
}

@Component({
  host: {
      '(document:click)': 'onClick($event)',
    },
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isdisplay:boolean=false
  searchData!:string;
  data:any;
  resultLength:number=0;
  films!:Observable<Film[]>;
  collapseMenu: boolean =true;
  constructor(private router: Router,private restapiservice: RestapiService,private _eref: ElementRef) { }

  

  ngOnInit(): void {
    // console.log(this.collapseMenu);
    
    this.url="assets/logo.png";
    // console.log(search);
    this.data = this.restapiservice.getAllFilms();
  }
  toggle(){
    this.collapseMenu = !this.collapseMenu
  }
  
  // toggleMenu(){
  //   let vv = document.getElementById("menuoptions");
  //   if(vv!=null && this.isdisplay ==false)
  //   {
  //   vv.style.display = "flex";
  //   this.isdisplay = true;
  //   }
  //   else if(vv!=null && this.isdisplay==true){
  //     vv.style.display = "none"
  //     this.isdisplay = false
  //   }
  // }


  isSticky: boolean = true;
  isFalse:boolean=true;
  url:string="assets/logo.png";


  


  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if(window.scrollY==0)
    {
      this.isFalse=false;
      this.url="assets/logo.png";
    }
    else{
    this.isFalse = true;
    this.url="assets/logo2.png";
  }
    this.isSticky = window.pageYOffset >= 0;

  }

  search(event: Event){
    this.searchData = (event.target as HTMLInputElement).value.toLowerCase();


    this.films = this.data.pipe(map((itt:any)=>{
      const values = itt.filter((row:any)=>row.full_name.toLowerCase()
      .match(this.searchData.toLowerCase()) ||row.release_date.match(this.searchData.toLowerCase()) 
      || row.film_genre.toLowerCase().match(this.searchData.toLowerCase())
       ||JSON.parse(row.cast_n_crew).actors[0].toLowerCase().match(this.searchData.toLowerCase())||
       JSON.parse(row.cast_n_crew).actors[1].toLowerCase().match(this.searchData.toLowerCase())||
       JSON.parse(row.cast_n_crew).crews[0].toLowerCase().match(this.searchData.toLowerCase()))

      // console.log(values);
      

      itt.forEach((item:any)=>{
        let dateSplit = item.release_date.split('-')
        let month_digit=parseInt(dateSplit[1])
        let month=["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"][month_digit-1];
        item.release_date=[dateSplit[2],month,dateSplit[0]].join(" ");
      })
      

      this.resultLength = values.length
      console.log(this.resultLength);
      return (this.searchData.length>0)?values:[]
    }))

    // this.films.subscribe()
    // window.history.pushState({},"", "search="+data);
}


getfilm(){

}

onClick(event: { target: any; }) {
  if (!this._eref.nativeElement.contains(event.target)){} // or some similar check
    var f=0
    // console.log(f);
    
 }

}
