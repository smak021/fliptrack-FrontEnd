import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError  } from 'rxjs';
import { Film } from './home/home.component';
import { catchError, retry } from 'rxjs/operators';
import { SFilm,DataTheatre,DataDate } from './film/film.component';
import {Data} from './track/track.component'

@Injectable({
  providedIn: 'root'
})
export class RestapiService {
  private REST_API_SERVER = "https://flicktracks.herokuapp.com/api/films/";


  constructor(private httpClient: HttpClient) { }
// Home Component
  getAllFilms():Observable<Film[]> {
    return this.httpClient.get<Film[]>(this.REST_API_SERVER).pipe(retry(3), catchError(this.handleError));
  }
// Film Component
  getSingleFilm(url:any):Observable<SFilm[]>{
    return this.httpClient.get<SFilm[]>("https://flicktracks.herokuapp.com/api/getfilm/"+url+"/").pipe(retry(3),catchError(this.handleError));
  }

  getDatabyDate(url:any):Observable<DataDate[]>{
    return this.httpClient.get<DataDate[]>("https://flicktracks.herokuapp.com/api/getbydate/"+url+"/")
  }

  getDatabyTheatre(film:any):Observable<DataTheatre[]>{
    return this.httpClient.get<DataTheatre[]>("https://flicktracks.herokuapp.com/api/getbytheatre/"+film+"/?format=json").pipe(retry(3),catchError(this.handleError))
  }

  topweek(option:any):Observable<Data[]>{
    return this.httpClient.get<Data[]>("https://flicktracks.herokuapp.com/api/topweek/"+option+"/?format=json").pipe(retry(3),catchError(this.handleError))
  }

  private handleError(error: any): Promise<any> {
    let errormsg = ''
    if(error.error instanceof ErrorEvent)
    {
      errormsg = `Error: ${error.message}`;
    }
    else{
      errormsg = `Error Code: ${error.status}\nMessage: Error`
    }
    
    console.error('An error occurred', errormsg);
    return Promise.reject(errormsg);
 }

}
