import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioItem, PortfolioItemDisplay, Summary, Wallet } from '../../../types';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';


@Component({
  selector: 'app-buy-sell-model',
  standalone: true,
  templateUrl: './buy-sell-model.component.html',
  styleUrls: ['./buy-sell-model.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class BuySellModelComponent {
  @Input() portfolioItem: PortfolioItemDisplay | undefined;
  @Input() summaryItem: Summary | undefined;
  @Input() action?: 'Buy' | 'Sell' | undefined;
  @Input() portfolioQuantity: number = 0;
  @Output() portfolioItemUpdated = new EventEmitter<void>();
  @Output() actionWithTicker = new EventEmitter<{ action: string, ticker: string }>();
  wallet!: Wallet;
  quantity = new FormControl('', [Validators.required, Validators.min(1)]);
  constructor(private modalService: NgbModal, private portfolioService: PortfolioService) { }

  closeModal() {
    this.modalService.dismissAll('Close click');
  }

  getButtonLabel(): string {
    return this.action === 'Buy' ? 'Buy' : 'Sell'; // Dynamically set button label based on action
  }

  onBuy(): void {

    if (this.summaryItem && this.quantity && this.quantity.value) {
      const quantityValue: number = +this.quantity.value;
      const totalCost: number = quantityValue * this.summaryItem.quote.c;

      const portfolioItemToAdd: PortfolioItem = {
        name: this.summaryItem.companyProfile.ticker,
        quantity: quantityValue,
        totalCost: totalCost
      };
      console.log(portfolioItemToAdd, "via update");
      if (this.portfolioQuantity == 0) {
        console.log(portfolioItemToAdd, "via add");
        this.addPortfolioItem(portfolioItemToAdd);
      }
      else {
        this.updatePortfolioItem(portfolioItemToAdd, this.summaryItem.companyProfile.ticker);
        console.log('Bought via update in summary');
      }
    }

    if (this.portfolioItem && this.quantity && this.quantity.value) {
      const quantityValue: number = +this.quantity.value;
      const totalCost: number = quantityValue * this.portfolioItem.c;

      const portfolioItemToAdd: PortfolioItem = {
        name: this.portfolioItem.ticker,
        quantity: quantityValue,
        totalCost: totalCost
      };
      console.log(portfolioItemToAdd, "via update");
      this.updatePortfolioItem(portfolioItemToAdd, this.portfolioItem.ticker);
      console.log('Bought via update in portfolio');
    }
    this.closeModal(); // Close modal after saving
    this.actionWithTicker.emit({ action: 'Buy', ticker: this.summaryItem?.companyProfile.ticker || this.portfolioItem?.ticker || '' });
  }

  onSell(): void {
    if (this.summaryItem && this.quantity && this.quantity.value) {
      const quantityValue: number = +this.quantity.value * (-1);
      const totalCost: number = quantityValue * this.summaryItem.quote.c;

      const portfolioItemToAdd: PortfolioItem = {
        name: this.summaryItem.companyProfile.ticker,
        quantity: quantityValue,
        totalCost: totalCost
      };
      if (quantityValue * (-1) === this.portfolioQuantity) {
        this.deletePortfolioItem(this.summaryItem.companyProfile.ticker);
      }
      else {
        this.updatePortfolioItem(portfolioItemToAdd, this.summaryItem.companyProfile.ticker);
      }
      console.log('Sold via update in summary');
    }
    if (this.portfolioItem && this.quantity && this.quantity.value) {
      const quantityValue: number = +this.quantity.value * (-1);
      const totalCost: number = quantityValue * this.portfolioItem.c;

      const portfolioItemToSell: PortfolioItem = {
        name: this.portfolioItem.ticker,
        quantity: quantityValue,
        totalCost: totalCost
      };
      if (quantityValue * (-1) === this.portfolioItem.quantity) {
        this.deletePortfolioItem(this.portfolioItem.ticker);
      }
      else {
        this.updatePortfolioItem(portfolioItemToSell, this.portfolioItem.ticker);

      }
      console.log('Sold via update in summary');
    }
    this.closeModal(); // Close modal after saving
    this.actionWithTicker.emit({ action: 'Sell', ticker: this.summaryItem?.companyProfile.ticker || this.portfolioItem?.ticker || '' });
  }

  loadWallet() {
    return this.portfolioService.getWallet(`api/wallet`);
  }

  addPortfolioItem(portfolioItem: PortfolioItem) {
    this.portfolioService.addPortfolioItem('api/portfolio', portfolioItem)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.portfolioItemUpdated.emit();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  updatePortfolioItem(portfolioItem: PortfolioItem, ticker: string) {
    this.portfolioService.updatePortfolioItem(`api/portfolio/${ticker}`, portfolioItem)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.portfolioItemUpdated.emit();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  deletePortfolioItem(ticker: string) {
    this.portfolioService
      .deletePortfolioItem(`api/portfolio/${ticker}`)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.portfolioItemUpdated.emit();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  ngOnInit() {
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
}
