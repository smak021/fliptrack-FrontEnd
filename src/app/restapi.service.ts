import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './home/home.component';
import { SingleFilm } from './film/film.component';

@Injectable({
  providedIn: 'root'
})
export class RestapiService {
  private REST_API_SERVER = "http://flicktracks.herokuapp.com/api/films/";
  constructor(private httpClient: HttpClient) { }

  getAllFilms():Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.REST_API_SERVER);
  }

  getSingleFilm(url:any):Observable<SingleFilm[]>{
    return this.httpClient.get<SingleFilm[]>("http://flicktracks.herokuapp.com/api/test/"+url+"/");
  }

  getCompleteFilm(url:any):Observable<any>{
    return this.httpClient.get<SingleFilm[]>("http://flicktracks.herokuapp.com/api/data/"+url+"/");
  }

}
