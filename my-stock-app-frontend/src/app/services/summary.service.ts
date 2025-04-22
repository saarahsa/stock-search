import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ChartDataItem, HourlyData, Quote, Search, Status, Summary, SummaryParams, SummaryResponse } from '../../types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  summary!: Summary;
  symbol!: string;
  storedSummary: Summary | undefined;
  storedQuote: Quote;
  storedLastTime: any;
  storedSymbol: string='';
  private baseUrl = 'https://my-stock-app-418019.uc.r.appspot.com/';


  constructor(private apiService: ApiService, private http: HttpClient) { }

  getSummary = (url: string, params: SummaryParams): Observable<SummaryResponse> => {
    return this.apiService.get(url,{
      params,
      responseType: 'json'
    })
  }

  getStatus = (url: string, params: SummaryParams): Observable<Status> => {
    return this.apiService.get(url,{
      params,
      responseType: 'json'
    })
  }

  getQuote = (url: string, params: SummaryParams): Observable<Quote> => {
    return this.apiService.get(url,{
      params,
      responseType: 'json'
    })
  }

  getAutocomplete(ticker: string) {
    return this.http.get(this.baseUrl + "api/autocomplete/" + ticker)
  }

  setSummary(summary: Summary): void {
    this.summary = summary;
  }

  getStoredSummary(): Summary {
    return this.summary;
  }

  getStoredSymbol(): string {
    return this.symbol;
  }
}
