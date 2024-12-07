import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Show } from '../models/show.model';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ShowsService {

  url: string = `http://localhost:3000/shows`;

  constructor(private _httpClient : HttpClient) { }

  addShow(show: Show) : Observable<Show> {
    return this._httpClient.post<Show>(this.url, show);
  }

  getShows() : Observable<Show[]> {
    return this._httpClient.get<Show[]>(this.url);
  }

  deleteShow(showId: string | undefined) : Observable<void> {
    return this._httpClient.delete<void>(this.url + `/${showId}`);
  }

  editShow(showId: string | undefined, updatedShow: Show) : Observable<Show>{
    return this._httpClient.put<Show>(this.url + `/${showId}`, updatedShow);
  }
}
