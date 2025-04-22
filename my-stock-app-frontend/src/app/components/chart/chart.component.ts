import { Component, Input } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
import indicators from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';
import { ChartDataItem } from '../../../types';

indicators(Highcharts);
vbp(Highcharts);

@Component({
    selector: 'app-chart',
    standalone: true,
    imports: [HighchartsChartModule],
    templateUrl: './chart.component.html',
    styleUrl: './chart.component.css'
})
export class ChartComponent {
    @Input() chartData!: ChartDataItem[];
    @Input() name!: string;
    @Input() ticker!: string;


    hourlyCharts: typeof Highcharts = Highcharts;
    stockChart = "stockChart";
    hourlyOptions: Highcharts.Options = {};
    newsData: any[] = [];
    chartOfCharts: typeof Highcharts = Highcharts;
    chartOptions: Highcharts.Options = {};
    lineColor: string = 'green';
    MSPR: number[] = [];
    CHANGE: number[] = [];
    recommendCharts: typeof Highcharts = Highcharts;
    recommendOptions: Highcharts.Options = {};
    surpriseCharts: typeof Highcharts = Highcharts;
    surpriseOptions: Highcharts.Options = {};

    chartstab() {
        const data = this.chartData;
        const stockData = [];
        let volume = [];
        let dataLength = data.length
        const groupingUnits: [string, number[] | null][] = [
            ['month', [1, 3, 6]], 
            ['year', [1]]
        ];

        for (let i = 0; i < dataLength; i += 1) {
            stockData.push([
                data[i].t,
                data[i].o,
                data[i].h,
                data[i].l,
                data[i].c
            ]);

            volume.push([
                data[i].t,
                data[i].v
            ]);
        }

        this.chartOptions = {
            rangeSelector: {
                buttons: [{
                    'type': 'month',
                    'count': 1,
                    'text': '1m',
                }, {
                    'type': 'month',
                    'count': 3,
                    'text': '3m',
                }, {
                    'type': 'month',
                    'count': 6,
                    'text': '6m',
                }, {
                    'type': 'ytd',
                    'text': 'YTD',
                }, {
                    'type': 'year',
                    'count': 1,
                    'text': '1Y',
                }, {
                    'type': 'all',
                    'text': 'All',
                }],
                selected: 2,
            },
            title: { text: this.ticker + ' Historical' },
            subtitle: { text: 'With SMA and Volume by Price technical indicators' },
            xAxis: {
                type: 'datetime'
            },
            yAxis: [{
                startOnTick: false,
                endOnTick: false,
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'OHLC'
                },
                height: '60%',
                lineWidth: 2,
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volume'
                },
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2
            }],
            tooltip: {
                split: true
            },
            chart: {
                backgroundColor: '#f4f4f4',
            },
            series: [{
                type: 'candlestick',
                name: this.ticker,
                id: this.ticker,
                zIndex: 2,
                data: stockData
            }, {
                type: 'column',
                name: 'Volume',
                id: 'volume',
                data: volume,
                yAxis: 1
            }, {
                type: 'vbp',
                linkedTo: this.ticker,
                params: {
                    volumeSeriesID: 'volume'
                },
                dataLabels: {
                    enabled: false
                },
                zoneLines: {
                    enabled: false
                }
            }, {
                type: 'sma',
                linkedTo: this.ticker,
                zIndex: 1,
                marker: {
                    enabled: false
                }
            }],
            time: {
                useUTC: false,
                timezone: 'America/Los_Angeles'
            },
        }
    }

    ngOnInit() {
        this.chartstab();
    }
}

