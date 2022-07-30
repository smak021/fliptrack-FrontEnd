import { animate, state, style, transition, trigger } from '@angular/animations';
import { ObserversModule } from '@angular/cdk/observers';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { catchError, expand, Observable,map, interval, of, EMPTY, throwError } from 'rxjs';
import { RestapiService } from '../restapi.service';
export interface Post{
  film_id: string;
  film_real_name:string
  film_name:string;
  cover_url:string;
  film_loc:string;
  release_date:string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  posts!:Observable<Post[]>;
  errorMessage!: string;
  title = 'scrap-view';
  items : string[] = [];
  interval!: any;
  constructor(private restapiservice: RestapiService) { }

  ngOnInit(): void {
    this.refreshData();
    //this.interval = interval(5000).subscribe(() => { 
        //this.refreshData(); 
    //});
    //window.scroll(0,0);
    
  }

  chechBox(filterYr: any){
    
    let checkBox = document.getElementById("year") as HTMLInputElement
    let checkBx2 = document.getElementById("year2") as HTMLInputElement
    let checkBx3 = document.getElementById("year3") as HTMLInputElement
    console.log(filterYr);
    if(checkBox.checked || checkBx2.checked || checkBx3.checked)
    {
      this.refreshData(filterYr)
    }
    else{
      this.refreshData()
    }
  }
  getData(fil = ""){
    this.posts= this.restapiservice.getAllFilms().pipe
    (map(posts=>
    {
      let i=0;
      let arr=[];
      let uniquearr:any={};
      posts.forEach(item=>{
        
        item.film_name = this.capitalizeFirstLetter(item.film_name)
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
        //console.log(uniquearr);
          i++;   
      })
      for(let i in uniquearr){
      arr.push(uniquearr[i]);}
      return arr;
    }));
  }
  refreshData(filYr = ""){
    if(filYr != "")
    {
      this.getData(filYr)
    }
    else{
      this.getData()
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

}
export class CardFancyExample {}