import { Component, Input } from '@angular/core';
import { CompanyProfile, HourlyData, Quote, Summary } from '../../../types';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
import indicators from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';

indicators(Highcharts);
vbp(Highcharts);

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [HighchartsChartModule, CommonModule, RouterModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  @Input() quote!: Quote;
  @Input() companyProfile!: CompanyProfile;
  @Input() peers!: [];
  @Input() hourlyData!: HourlyData[];
  @Input() ticker!: string;

  // isHighcharts = typeof Highcharts === 'object';
  // title = 'Hourly Price Variation';
  // Highcharts: typeof Highcharts = Highcharts;
  // chartConstructor: string = 'chart';
  // chartOptions: Highcharts.Options = {};
  hourlyCharts: typeof Highcharts = Highcharts;
  stockChart = "stockChart";
  hourlyOptions: Highcharts.Options = {};
  lineColor: string = 'green';


  constructor(private router: Router, private route: ActivatedRoute) {
  }

  onWatchlistItemClick(symbol: string) {
    this.router.navigate(['/search', symbol], { queryParams: { reload: true } });
    // this.reloadCurrentRoute(symbol);
  }

  reloadCurrentRoute(symbol: string) {
    this.router.navigateByUrl('/search' + symbol).then(() => {
      this.router.navigate([this.route.snapshot.url], { queryParams: { refresh: new Date().getTime() } });
    });
  }

  summaryTab() {
    const chartData = this.hourlyData;
    const priceData: [number, number][] = [];
    for (let i = chartData.length - 1; i >= 0; i--) {
      priceData.unshift([chartData[i].t, chartData[i].c]);
      if (priceData.length >= 32) {
        break;
      }
    }
    if (this.quote.d > 0) {
      this.lineColor = 'green';
    }
    else {
      this.lineColor = 'red';
    }
    this.hourlyOptions = {
      colors: [this.lineColor],
      rangeSelector: {
        enabled: false
      },
      navigator: {
        enabled: false
      },
      title: {
        text: this.ticker + ' Hourly Price Variation',
        style: {
          color: 'gray',
        },
      },
      xAxis: {
        type: 'datetime',
      },
      series: [{
        name: this.ticker,
        data: priceData,
        type: 'line',
      }],
      tooltip: {
        split: true,
      },
      time: {
        useUTC: false,
        timezone: 'America/Los_Angeles'
      },
      legend: {
        enabled: false
      },
      chart: {
        backgroundColor: '#f4f4f4',
      },
    };
  }

  ngOnInit() {
    this.summaryTab();
  }
}
