import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { PortfolioItemDisplay, Quote, Summary, SummaryResponse, WatchListItemDisplay } from '../../../types';
import { CommonModule } from '@angular/common';
import { WatchlistService } from '../../services/watchlist.service';
import { WatchListItem } from '../../../types';
import { BuySellModelComponent } from '../buy-sell-model/buy-sell-model.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { TopNewsComponent } from '../top-news/top-news.component';
import { InsightsComponent } from '../insights/insights.component';
import { ChartComponent } from '../chart/chart.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SummaryComponent } from '../summary/summary.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioService } from '../../services/portfolio.service';
// import { SummaryComponent } from '../summary/summary.component';
// import * as Highcharts from "highcharts/highstock";
// import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, BuySellModelComponent, MatTabsModule, TopNewsComponent, InsightsComponent, ChartComponent, MatProgressSpinnerModule, SummaryComponent, NgbAlertModule],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent {
  @Input() summary!: Summary;
  @Input() quote!: Quote;
  @Input() lastTime?: any;
  // @Output() reloadSummary: EventEmitter<void> = new EventEmitter<void>();
  @Input() currentDate?: Date;
  watchlistItems: WatchListItemDisplay[] = [];
  checkWatchlistItem: WatchListItemDisplay[] = [];
  checkportfolioItem: PortfolioItemDisplay[] = [];
  summaryItem: Summary | undefined;
  starIconFilled: boolean = false;
  portfolioQuantity = 0;
  action?: 'Buy' | 'Sell' | undefined;
  sellButton: boolean = false;
  actionSelected: string = '';
  tickerTransacted: string = '';
  tickerToWatchlist: string = '';
  autoDismissTimeout: any;
  showBuyAlert: boolean = false;
  showSellAlert: boolean = false;
  showWatchlistAlert: boolean = false;

  private modalService = inject(NgbModal);
  modalData: any;
  @ViewChild('contentModal', { static: true }) contentModal!: ElementRef;

  constructor(private watchlistService: WatchlistService, private portfolioService: PortfolioService) {
    this.action = undefined;
  }

  toggleStarIcon() {
    if (this.summary && this.summary.companyProfile.ticker) {
      if (!this.starIconFilled) {
        const watchlistItem: any = {
          name: this.summary?.companyProfile.ticker
        };
        this.tickerToWatchlist = this.summary?.companyProfile.ticker;
        this.showWatchlistAlert = true;
        this.addWatchlistItem(watchlistItem);
        this.autoDismissAlertAfterDelay();
      }
      else {
        this.deleteWatchListItem(this.summary?.companyProfile.ticker);
      }
      this.starIconFilled = !this.starIconFilled;
    }
  }

  triggerReload() {
    // this.sellButton=false;
    // this.sellButton=true;
    this.loadPortfolio().subscribe({
      next: (data: PortfolioItemDisplay[]) => {
        this.checkportfolioItem = data;
        console.log(this.checkportfolioItem)
        // this.isLoading = false; // Set loading state to false after data is fetched
        this.checkportfolioItem.forEach(element => {
          console.log(this.summary.companyProfile.ticker)
          if (element.ticker == this.summary.companyProfile.ticker) {
            this.sellButton = true;
            this.portfolioQuantity = element.quantity;
          }
        });
      },
      error: (error) => {
        console.error('Error fetching portfolio items:', error);
        // this.isLoading = false; // Ensure loading state is set to false even if there's an error
      }
    });
    if (this.portfolioQuantity == 0) {
      this.sellButton = false;
    }
    // this.reloadSummary.emit();
  }

  addWatchlistItem(watchlistItem: WatchListItem) {
    this.watchlistService.addWatchlistItem('api/watchlist', watchlistItem)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  deleteWatchListItem(ticker: string) {
    this.watchlistService
      .deleteWatchListItem(`api/watchlist/${ticker}`)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.watchlistItems = this.watchlistItems.filter(item => item.ticker !== ticker);
          // this.fetchWatchlist();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  loadWatchlist() {
    return this.watchlistService.getWatchList(`api/watchlist`);
  }

  loadPortfolio() {
    return this.portfolioService.getPortfolio('api/portfolio');
  }

  open(content: TemplateRef<any>, summary: Summary, action: 'Buy' | 'Sell') {
    this.summaryItem = summary;
    this.action = action;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }
    )
  }

  handleActionWithTicker(event: { action: string, ticker: string }) {
    this.actionSelected = event.action;
    this.tickerTransacted = event.ticker;
    if (this.actionSelected === 'Buy') {
      this.showBuyAlert = true;
      this.autoDismissAlertAfterDelay();
    } else if (this.actionSelected === 'Sell') {
      this.showSellAlert = true;
      this.sellButton = true;
      this.autoDismissAlertAfterDelay();
    }
  }
  dismissAlert() {
    this.actionSelected = '';
    clearTimeout(this.autoDismissTimeout);
    this.showBuyAlert = false;
    this.showSellAlert = false;
  }

  autoDismissAlertAfterDelay() {
    this.autoDismissTimeout = setTimeout(() => {
      this.dismissAlert();
    }, 5000);
  }

  ngOnInit() {
    console.log("isStarred kmkc")
    this.starIconFilled = false;
    this.loadWatchlist().subscribe({
      next: (data: WatchListItemDisplay[]) => {
        this.checkWatchlistItem = data;
        console.log(this.checkWatchlistItem)
        // this.isLoading = false;
        this.checkWatchlistItem.forEach(element => {
          if (element.ticker == this.summary.companyProfile.ticker) {
            this.starIconFilled = true;
          }
        });
      },
      error: (error) => {
        console.error('Error fetching watchlist items:', error);
        // this.isLoading = false;
      }
    });

    this.loadPortfolio().subscribe({
      next: (data: PortfolioItemDisplay[]) => {
        this.checkportfolioItem = data;
        console.log(this.checkportfolioItem)
        // this.isLoading = false; 
        this.checkportfolioItem.forEach(element => {
          console.log(this.summary.companyProfile.ticker)
          if (element.ticker == this.summary.companyProfile.ticker) {
            this.sellButton = true;
            this.portfolioQuantity = element.quantity;
          }
        });
      },
      error: (error) => {
        console.error('Error fetching portfolio items:', error);
        // this.isLoading = false; 
      }
    });
  }


}
