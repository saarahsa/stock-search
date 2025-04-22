import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PortfolioItemDisplay, Wallet } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(private apiService: ApiService) { }

  addPortfolioItem = (url: string, body: any): Observable<any> => {
    return this.apiService.post(url, body, {});
  };

  getPortfolio = (
    url: string
  ): Observable<PortfolioItemDisplay[]> => {
    return this.apiService.get(url, {
      responseType: 'json',
    });
  };

  getWallet = (
    url: string
  ): Observable<Wallet> => {
    return this.apiService.get(url, {
      responseType: 'json',
    });
  };

  deletePortfolioItem = (url: string): Observable<any> => {
    return this.apiService.delete(url, {});
  };

  updatePortfolioItem = (url: string, body: any): Observable<any> => {
    return this.apiService.put(url, body, {});
  };
}
