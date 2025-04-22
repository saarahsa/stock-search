import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface Options {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    context?: HttpContext;
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    transferCache?: {
        includeHeaders?: string[];
    } | boolean;
}

export interface Summary {
    polygonData: ChartDataItem[],
    companyProfile: CompanyProfile,
    quote: Quote,
    recommendation: RecommendationItem[],
    news: NewsItem[],
    insider: InsiderItem[],
    peers: [],
    earnings: EarningsItem[],
    status: string
    hourlyData: HourlyData[]
}

export interface SummaryNotFound {
    dataNotFound: true;
}

export interface Wallet {
    balance: number,
}

export type SummaryResponse = Summary | SummaryNotFound;

export interface CompanyProfile {
    country: string,
    currency: string,
    estimateCurrency: string,
    exchange: string,
    finnhubIndustry: string,
    ipo: string,
    logo: string,
    marketCapitalization: number,
    name: string,
    phone: string,
    shareOutstanding: number,
    ticker: string,
    weburl: string
}

export interface Quote {
    c: number,
    d: number,
    dp: number,
    h: number,
    l: number,
    o: number,
    pc: number,
    t: number
}

export interface NewsItem {
    category: string,
    datetime: number,
    headline: string,
    id: number,
    image: string,
    related: string,
    source: string,
    summary: string,
    url: string
}

export interface RecommendationItem {
    buy: number,
    hold: number,
    period: string,
    sell: number,
    strongBuy: number,
    strongSell: number,
    symbol: string
}

export interface InsiderItem {
    symbol: string,
    year: number,
    month: number,
    change: number,
    mspr: number
}

export interface EarningsItem {
    actual: number,
    estimate: number,
    period: string,
    quarter: number,
    surprise: number,
    surprisePercent: number,
    symbol: string,
    year: number
}

export interface ChartDataItem {
    v: number,
    vw: number,
    o: number,
    c:number,
    h: number,
    l: number,
    t: number,
    n: number
}

export interface Search {
    description: string,
    displaySymbol: string,
    symbol: string,
    type: string
}

export interface Status {
    status: string
}

export interface HourlyData {
    v: number,
    vw: number,
    o: number,
    c: number,
    h: number,
    l: number,
    t: number,
    n: number
}

export interface SummaryParams {
    [param: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string | number | boolean>;
    symbol: string;
    token: string;
}

export interface WatchListItem {
    _id?: string; 
    name: string;
    __v?: number;
}

export interface WatchListItemDisplay {
    name: string,
    ticker: string,
    c: number,
    d: number,
    dp: number,
    h: number,
    l: number,
    o: number,
    pc: number
}

export interface PortfolioItem {
    _id?: string;
    name: string;
    quantity: number;
    totalCost: number;
    __v?: number;
}

export interface PortfolioItemDisplay {
    name: string,
    ticker: string,
    quantity: number,
    totalCost: number,
    walletMoney: number,
    c: number,
    d: number,
    dp: number,
    h: number,
    l: number,
    o: number,
    pc: number
}