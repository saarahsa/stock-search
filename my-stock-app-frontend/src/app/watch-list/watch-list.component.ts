import { Component, OnInit } from '@angular/core';
import { WatchlistService } from '../services/watchlist.service';
import { Summary, WatchListItemDisplay } from '../../types';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SummaryService } from '../services/summary.service';
import { FooterComponent } from '../layout/footer/footer.component';

@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatProgressSpinnerModule, NgbAlertModule, FooterComponent],
  templateUrl: './watch-list.component.html',
  styleUrl: './watch-list.component.css'
})
export class WatchListComponent implements OnInit {

  constructor(private watchlistService: WatchlistService, private router: Router, private summaryService: SummaryService) {}

  watchlistItems: WatchListItemDisplay[] = [];
  summary: Summary | undefined;
  starIconFilled: boolean = false;
  lastTime: any;
  isLoading: boolean = true;

  fetchWatchlist() {
    this.isLoading = true;
    this.watchlistService
      .getWatchList(`api/watchlist`)
      .subscribe({
        next: (data: WatchListItemDisplay[]) => {
          this.watchlistItems = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching watchlist items:', error);
          this.isLoading = false;
        }
      });
  }

  deleteWatchListItem(ticker: string, event: MouseEvent) {
    event.stopPropagation();
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

  onWatchlistItemClick(symbol: string) {
    this.router.navigate(['/search', symbol]);
  }

  ngOnInit() {
    this.fetchWatchlist();
  }
}
