import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { WatchListItemDisplay } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor(private apiService: ApiService) {}

  addWatchlistItem = (url: string, body: any): Observable<any> => {
    return this.apiService.post(url, body, {});
  };

  getWatchList = (
    url: string
  ): Observable<WatchListItemDisplay[]> => {
    return this.apiService.get(url, {
      responseType: 'json',
    });
  };

  deleteWatchListItem = (url: string): Observable<any> => {
    return this.apiService.delete(url, {});
  };
}
