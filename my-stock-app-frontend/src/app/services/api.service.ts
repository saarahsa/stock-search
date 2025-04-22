import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Options, PortfolioItem, WatchListItem } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://my-stock-app-418019.uc.r.appspot.com/';
  // private baseUrl = 'https://localhost:3000/';

  constructor(
    private httpClient: HttpClient
  ) { }

  get<T>(endpoint: string, options: Options): Observable<T> {
    const url = this.baseUrl + endpoint;
    return this.httpClient.get<T>(url, options) as Observable<T>;
  }

  post<T>(endpoint: string, body: WatchListItem, options: Options): Observable<T> {
    const url = this.baseUrl + endpoint;
    return this.httpClient.post<T>(url, body, options) as Observable<T>;
  }

  delete<T>(endpoint: string, options: Options): Observable<T> {
    const url = this.baseUrl + endpoint;
    return this.httpClient.delete<T>(url, options) as Observable<T>;
  }

  put<T>(endpoint: string, body: PortfolioItem, options: Options): Observable<T> {
    const url = this.baseUrl + endpoint;
    return this.httpClient.put<T>(url, body, options) as Observable<T>;
  }

}
