import { Component, OnInit } from '@angular/core';
import { RestapiService } from '../restapi.service';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";

export interface Data{
film_id:string;
total:number;
film_name:string;
lineChartData: ChartConfiguration<'line'>['data'] ;
dateData:[{
  date:string,
  total_amount:number
}];
release_date:string;
cover_pic:string;
}

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  from!:number;
  to!:string
data!:Data[]
weekdays:any
public lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  locale:'en-In',
  scales: {
    y:{
     display:false,
    },
    x:{
      display:false,
    }
  }
  
};
public lineChartLegend = false;

  constructor(private restapiservice: RestapiService) { }

  ngOnInit(): void {

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

  //   this.weekdays = this.weekfind()

  //   function join(t:any, a:any, s:any) {
  //     function format(m:any) {
  //        let f = new Intl.DateTimeFormat('en', m);
  //        return f.format(t);
  //     }
  //     return a.map(format).join(s);
  //  }
   
  //  let a = [{year: 'numeric'},{month: '2-digit'},{day: '2-digit'}];
  //  let d1 = join(this.weekdays[0], a, '');
  //  let d2 = join(this.weekdays[1],a,'')
    // var options = { year: 'numeric', month: 'numeric', day: 'numeric' };

    
    // let d1 = this.weekdays[0].toLocaleDateString("en-IN", options);
    // console.log(d1);
    
    this.restapiservice.topweek(1).subscribe((item:any)=>{
      this.from = dateFormat(item['from'],false,false)
      this.to = dateFormat(item['to'],false,false)
      this.data = item['toptotal']
      let othr:any = item['topdata']
      this.data.forEach(val=>{
        val.release_date = dateFormat(val.release_date,false,true)
        let label_data:string[]=[];
        let dataa:number[]=[];
        val.dateData = othr.filter((i:any)=>{
          return i['film_id']==val.film_id
         })
        val.dateData.forEach(i=>{
          i.date = dateFormat(i.date,false,false)
          label_data.push(i.date.slice(0,6))
          dataa.push(i.total_amount)
         })
        val.lineChartData= {
          labels: label_data,
          datasets: [
            {
              pointRadius:0,
              data: dataa,
              label: 'Amount',
              fill: true,
              clip:5,
              tension: 0.5,
              borderColor: 'white',
              backgroundColor: 'rgba(119, 83, 204, 0.8)'
            }
          ]
        }; 
      })
    })
  }
weekfind(){
  let dateone = new Date()
  let datetwo = new Date()
  let offset=0
  let day = dateone.getDay();
  // console.log(day);
  if(day<4)
  {
    offset = day + 5
  }
  else{
    offset = day - 4 
  }
  datetwo.setDate(datetwo.getDate()-offset)
  dateone.setDate(datetwo.getDate() - 6)
  console.log("Dates",dateone,datetwo);
  return [dateone,datetwo]
}


}
