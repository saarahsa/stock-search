import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WatchListComponent } from './watch-list/watch-list.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

export const routes: Routes = [
    { path: '', redirectTo: '/search/home', pathMatch: 'full'},
    {
        path:'search/home',
        component: HomeComponent
    },
    { 
        path: 'search/:symbol', 
        component: HomeComponent },
    {
        path:'watchlist',
        component: WatchListComponent
    },
    {
        path:'portfolio',
        component: PortfolioComponent
    }
];