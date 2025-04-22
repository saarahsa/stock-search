import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TopNavbarComponent } from '../layout/top-navbar/top-navbar.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { SummaryService } from '../services/summary.service';
import { Summary, NewsItem, SummaryResponse, SummaryNotFound, Status, Quote } from '../../types';
import { CompanyProfileComponent } from '../components/company-profile/company-profile.component';
import { CommonModule } from '@angular/common';
import { Form, FormControl } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../layout/footer/footer.component';
import { Observable, filter, map } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopNavbarComponent, SearchBarComponent, CompanyProfileComponent, CommonModule, MatProgressSpinnerModule, NgbAlertModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  @ViewChild(SearchBarComponent) searchBarComponent!: SearchBarComponent;
  summary: Summary | undefined;
  quote: Quote;
  isLoading: boolean = false;
  isPresent: boolean = true;
  private intervalId: any;

  constructor(
    private summaryService: SummaryService, private router: Router, private route: ActivatedRoute
  ) { }

  lastTime: any;
  currentDate: Date = new Date();
  status: Status | undefined;
  symbolValue: string | undefined;

  // reloadCompanySummary(ticker: string){
  //   this.fetchSummary(ticker);
  // }

  fetchData(symbol: string) {
    if (symbol) {
      this.fetchSummary(symbol);
      this.symbolValue = symbol;
    }
  }

  fetchSummary(symbol: string) {
    this.isLoading = true;
    this.isPresent = true;
    // this.symbolValue=symbol;
    this.router.navigate(['/search', symbol]);
    // this.searchBarComponent.setSearchValue(this.symbol.value);
    this.summaryService
      .getSummary('search', { symbol, token: 'cnppo31r01qgjjvqu43gcnppo31r01qgjjvqu440' })
      .subscribe({
        next: (summary: SummaryResponse) => {
          if ('dataNotFound' in summary) {
            this.isPresent = false;
            console.log('Summary data not found');
            this.isLoading = false;
          }
          else {
            this.summary = summary;
            this.summaryService.storedSummary = summary;
            this.summaryService.storedSymbol = symbol;
            this.lastTime = this.formatDateFromEpoch(this.summary.quote.t);
            this.summaryService.storedLastTime = this.lastTime;
            this.isLoading = false;
            // this.isPresent = true;
            console.log("summary fetched", this.summary);
            console.log("summary insider", summary.insider)
            this.fetchQuote(symbol);
            // console.log("symbol stored", this.summaryService.storedSymbol);
          }
        },
        error: (error) => {
          console.error('Error fetching summary items:', error);
          this.isLoading = false;
        }
      });
  }

  fetchQuote(symbol:string){
    this.summaryService
      .getQuote('api/quote', { symbol, token: 'cnppo31r01qgjjvqu43gcnppo31r01qgjjvqu440' })
      .subscribe({
        next: (quote: Quote) => {
            this.quote = quote;
            this.summaryService.storedQuote = quote;
            this.lastTime = this.formatDateFromEpoch(this.summary.quote.t);
            this.summaryService.storedLastTime = this.lastTime;
            console.log("quote fetched", this.quote);
          },
        error: (error) => {
          console.error('Error fetching quote', error);
          // this.isLoading = false;
        }
  });
  }

  resetSummary() {
    this.summary = undefined;
    this.isLoading = false;
    this.isPresent = true;
    this.router.navigate(['/search/home']);
    this.summaryService.storedSummary = undefined;
    this.summaryService.storedSymbol = '';
    // this.symbolValue='';
  }

  formatDateFromEpoch(epochTime: number): string {
    if (!epochTime) {
      return '';
    }
    const date = new Date(epochTime * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  ngOnInit() {
    // const symbol = this.route.snapshot.paramMap.get('symbol');
    this.route.paramMap.subscribe(params => {
      const symbol = params.get('symbol');
      if (symbol) {
        this.fetchSummary(symbol);
      }
    });
    this.summary = this.summaryService.storedSummary;
    this.lastTime = this.summaryService.storedLastTime;
    this.quote = this.summaryService.storedQuote;

    this.startInterval();

    // Listen to router events to stop the setInterval when navigating away from this page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url !== "'/search/'+this.summaryService.storedSymbol") {
        this.stopInterval();
      } else {
        this.startInterval();
      }
    });
    // setInterval(() => {
    //   console.log("isLoading", this.isLoading);
    //   console.log("symbol Value", this.summaryService.storedSymbol);
    //   console.log("Fetched?", this.summary)
    //   console.log(this.summaryService.storedSummary?.status)
    //   if (!this.isLoading && (this.summary!=undefined && this.summary.status==='closed' )){
    //     // (this.summaryService.storedSummary!= undefined && this.summaryService.storedSummary.status==='open')
    //     this.fetchSummary(this.summaryService.storedSymbol);
    //     this.currentDate=new Date();
    //   }
    // }, 15000);
  }

  ngOnDestroy(): void {
    // Stop the setInterval when this component is destroyed
    this.stopInterval();
  }

  startInterval(): void {
    this.intervalId = setInterval(() => {
      console.log("isLoading", this.isLoading);
      console.log("symbol Value", this.summaryService.storedSymbol);
      console.log("Fetched? Quote", this.quote)
      console.log(this.summaryService.storedSummary?.status)
      if (!this.isLoading && (this.summary!=undefined && this.summary.status==='open')){
        // (this.summaryService.storedSummary!= undefined && this.summaryService.storedSummary.status==='open')
        this.fetchQuote(this.summaryService.storedSymbol);
        this.currentDate=new Date();
      }
    }, 15000);
  }

  stopInterval(): void {
    clearInterval(this.intervalId);
  }
}