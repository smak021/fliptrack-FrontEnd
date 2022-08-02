import { animate, state, style, transition, trigger } from '@angular/animations';
import { ObserversModule } from '@angular/cdk/observers';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, HostListener, Input, OnInit, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import { catchError, expand, Observable,map, interval, of, EMPTY, throwError, filter, Subscriber, observable, mergeMap } from 'rxjs';
import { RestapiService } from '../restapi.service';
import { isThisTypeNode } from 'typescript';
export interface Post{
  film_id: string;
  full_name:string;
  film_name:string;
  cover_url:string;
  film_genre:string;
  jsoncon:any;
  cast_n_crew:any;
  film_loc:string;
  release_date:string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {


  totalcols:number=10;
  cols:number = 2;
  rows:number = 3;
  checkPost!:Observable<Post[]>;
  posts!:Observable<Post[]>;
  errorMessage!: string;
  title = 'scrap-view';
  items : string[] = [];
  interval!: any;
  constructor(private restapiservice: RestapiService) { }

  ngOnInit(): void {
    this.resposive();
    
    
    this.refreshData();
    // window.addEventListener("resize", this.resposive);
    
  }

  resposive()
  {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    
    
    if(width>900)
    {
      
      this.totalcols=20;
      this.cols = 4;
      this.rows = 4;
    }
    else
    if(width<=900 && width>500)
    {
      this.totalcols = 6;
      this.cols = 2;
      this.rows = 3;
    }
    else if(width<=500 && width >300){

      this.totalcols = 4;
      this.cols = 2;
      this.rows = 3;
    }
    else if(width<=350)
    {

      this.totalcols = 2
      this.cols = 2;
      this.rows = 3;
    }
    
  }

  chechBox(filterYr: any){
    
    let checkBox = document.getElementById("year") as HTMLInputElement
    let checkBx2 = document.getElementById("year2") as HTMLInputElement
    let checkBx3 = document.getElementById("year3") as HTMLInputElement
    if(checkBox.checked || checkBx2.checked || checkBx3.checked)
    {
      this.refreshData(filterYr)
    }
    else{
      this.refreshData()
    }
  }
  getData(fil = "", data:any){
    let arr:any=[];
    
    this.posts= this.restapiservice.getAllFilms().pipe(map(itt=>
      {
        if(data!=null){
          return data;
        }
        while(arr.length>0){
          arr.pop();
        }
        let i=0;
        let uniquearr:any={};
        itt.forEach(item=>{
          let dateSplit = item.release_date.split('-')
          item.release_date = dateSplit[2]+'-'+dateSplit[1]+'-'+dateSplit[0];
          let objtitle=item['film_id'];
          if(fil == dateSplit[0])
          {
          uniquearr[objtitle]=item;
          }
          else if(fil == "")
          {
            uniquearr[objtitle]=item;
          }
          
          
            i++;   
        })
        
        for(let i in uniquearr)
        {
        arr.push(uniquearr[i]);
        
      }
      return arr;
    }
      ));
  }

    refreshData(filYr = ""){
      
      if(filYr != "")
      {
        
        this.getData(filYr, null)
      }
      else{
        
        this.getData("",null)
      }
    
    
    }
  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    
    this.isSticky = window.pageYOffset >= 50;
  }

  capitalizeFirstLetter(string: string) {
    let value,new_value;
    new_value=string.replace(/-/g,' ');

    var splitStr = new_value.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

     splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    value = splitStr.join(' '); 
    
    return value;
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
   
    let test = this.restapiservice.getAllFilms()
    .pipe(map(arr => arr.filter(r=>r.full_name.toLowerCase()
    .match(filterValue) || r.release_date.match(filterValue) 
    || r.film_genre.toLowerCase().match(filterValue)
     ||JSON.parse(r.cast_n_crew).actors[0].toLowerCase().match(filterValue)||
     JSON.parse(r.cast_n_crew).actors[1].toLowerCase().match(filterValue)||
     JSON.parse(r.cast_n_crew).crews[0].toLowerCase().match(filterValue))))
  let res = test.subscribe(res=> this.getData("", res))
  // res.unsubscribe()
  
  }
}
export class CardFancyExample {}