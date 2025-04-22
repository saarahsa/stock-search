import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';
import { PortfolioItemDisplay, Wallet } from '../../types';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuySellModelComponent } from '../components/buy-sell-model/buy-sell-model.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FooterComponent } from '../layout/footer/footer.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BuySellModelComponent, MatProgressSpinnerModule, NgbAlertModule, HttpClientModule, FooterComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit {
  private modalService = inject(NgbModal);
  quantity = new FormControl('', [Validators.required, Validators.min(1)]);
  selectedItem: PortfolioItemDisplay | undefined;
  action?: 'Buy' | 'Sell' | undefined;
  actionSelected: string = '';
  tickerTransacted: string = '';
  wallet: Wallet;

  constructor(private portfolioService: PortfolioService, private router: Router) {
    this.action = undefined;
  }

  portfolioItems: PortfolioItemDisplay[] = [];
  isLoading: boolean = true;
  autoDismissTimeout: any;
  showBuyAlert: boolean = false;
  showSellAlert: boolean = false;


  reloadPortfolio() {
    // this.fetchPortfolio();
    this.ngOnInit();
    // this.loadWallet();
  }

  fetchPortfolio() {
    this.isLoading = true;
    this.portfolioService
      .getPortfolio('api/portfolio')
      .subscribe({
        next: (data: PortfolioItemDisplay[]) => {
          this.portfolioItems = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching portfolio items:', error);
          this.isLoading = false;
        }
      });
  }

  deletePortfolioItem(ticker: string) {
    this.portfolioService
      .deletePortfolioItem(`api/portfolio/${ticker}`)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.portfolioItems = this.portfolioItems.filter(item => item.ticker !== ticker);
          // this.fetchWatchlist();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnInit() {
    this.fetchPortfolio();

    this.loadWallet().subscribe({
      next: (data: Wallet) => {
        this.wallet = data;
        console.log(this.wallet);
      },
      error: (error) => {
        console.error('Error fetching wallet items:', error);
        // this.isLoading = false; // Ensure loading state is set to false even if there's an error
      }
    });
  }

  loadWallet() {
    return this.portfolioService.getWallet(`api/wallet`);
  }

  handleActionWithTicker(event: { action: string, ticker: string }) {
    this.actionSelected = event.action;
    this.tickerTransacted = event.ticker;
    if (this.actionSelected === 'Buy') {
      this.showBuyAlert = true;
      this.autoDismissAlertAfterDelay();
    } else if (this.actionSelected === 'Sell') {
      this.showSellAlert = true;
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

  open(content: TemplateRef<any>, item: PortfolioItemDisplay, action: 'Buy' | 'Sell') {
    this.selectedItem = item;
    this.action = action;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }
    )
  }

  onWatchlistItemClick(symbol: string) {
    this.router.navigate(['/search', symbol]);
  }

}
