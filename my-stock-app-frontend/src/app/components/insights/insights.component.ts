import { Component, Input } from '@angular/core';
import { EarningsItem, InsiderItem, RecommendationItem } from '../../../types';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css'
})
export class InsightsComponent {
  @Input() insiderData!: InsiderItem[];
  @Input() recommendationData!: RecommendationItem[];
  @Input() epsData!: EarningsItem[];
  @Input() name!: string;

  surprises = this.epsData?.map(item => item.surprise) || [];
  categories = this.epsData?.map(item => item.period) || [];
  actualData = this.epsData?.map(item => item.actual) || [];
  estimateData = this.epsData?.map(item => item.estimate) || [];


  totalMSPR = 0;
  positiveMSPR = 0;
  negativeMSPR = 0;
  totalChange = 0;
  positiveChange = 0;
  negativeChange = 0;

  isHighcharts = typeof Highcharts === 'object';
  titleR = 'Recommendation Trends';
  titleE = 'Historical EPS Surprises';
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart';
  chartOptionsR: Highcharts.Options = {};
  chartOptionsE: Highcharts.Options = {};

  constructor() {
  }

  calculateTotals() {
    this.insiderData.forEach(item => {
      this.totalMSPR += item.mspr;
      this.totalChange += item.change;

      if (item.mspr > 0) {
        this.positiveMSPR += item.mspr;
      } else {
        this.negativeMSPR += item.mspr;
      }

      if (item.change > 0) {
        this.positiveChange += item.change;
      } else {
        this.negativeChange += item.change;
      }
    });
  }

  generateChartOptions() {
    const categories = this.epsData?.map(item => item.period) || [];
    const actualData = this.epsData?.map(item => item.actual) || [];
    const estimateData = this.epsData?.map(item => item.estimate) || [];
    const surprises = this.epsData?.map(item => item.surprise) || [];
    this.chartOptionsE = {
      tooltip: {
        useHTML: true,
        formatter: function () {
          const pointIndex = this.points[0].point.index;
          const date = categories[pointIndex];
          const surprise = surprises[pointIndex];
          let tooltipContent = `${date}<br>`;
          tooltipContent += `Surprise: ${surprise}<br>`;

          this.points.forEach(point => {
            const value = point.y;
            const seriesName = point.series.name;
            let iconHtml = '';
            const color = point.color;
            if (seriesName === 'Actual') {
              iconHtml = '<span style="color: #29a8fa;">⬤</span>';
            } else if (seriesName === 'Estimated') {
              iconHtml = '<span style="color: #4b4cba;">⬤</span>';
            }
            tooltipContent += `${iconHtml} <strong>${seriesName}:</strong> ${value}<br>`;
          });



          return tooltipContent;
        },
        shared: true
      },
      chart: {
        type: 'spline',

        backgroundColor: '#f4f4f4',

      },
      title: { text: this.titleE },
      xAxis: {
        categories: categories,
        reversed: false,
        maxPadding: 0.05,
        showLastLabel: true,
        labels: {
          align: 'center',
          formatter: function () {
            const surprise = surprises[this.pos];
            return `<div style="text-align: center;">${this.value}<br/>Surprise: ${surprise}</div>`;
          },
          useHTML: true
        }
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS'
        }
      },
      legend: {
        enabled: true
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: true
          }
        }
      },
      series: [
        {
          type: 'spline',
          name: 'Actual',
          data: actualData
        },
        {
          type: 'spline',
          name: 'Estimated',
          data: estimateData
        }
      ]
    };
  }

  ngOnInit() {
    console.log("insider data from insights", this.insiderData);
    this.calculateTotals();

    this.chartOptionsR = {
      tooltip: {
        split: true
      },
      chart: {
        type: 'column',
        backgroundColor: '#f4f4f4',

      },
      title: { text: this.titleR },
      xAxis: {
        categories: this.recommendationData.map(item => item.period)
      },
      yAxis: {
        min: 0,
        title: {
          text: '# Analysis'
        },
        stackLabels: {
          enabled: true
        }
      },
      legend: {
        enabled: true
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },

      series: [
        {
          name: 'Strong Buy',
          type: 'column',
          data: this.recommendationData.map(item => item.strongBuy),
          color: '#177b3f'
        },
        {
          name: 'Buy',
          type: 'column',
          data: this.recommendationData.map(item => item.buy),
          color: '#20c15e'
        }, {
          name: 'Hold',
          type: 'column',
          data: this.recommendationData.map(item => item.hold),
          color: '#c2961f'
        }, {
          name: 'Sell',
          type: 'column',
          data: this.recommendationData.map(item => item.sell),
          color: '#f56667'
        }, {
          name: 'Strong Sell',
          type: 'column',
          data: this.recommendationData.map(item => item.strongSell),
          color: '#8c3938'
        }]
    };

    this.generateChartOptions();

  }
}
