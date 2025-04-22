# Stock Search Application

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [API Documentation](#api-documentation)

## Overview
A full-stack stock market application built with Angular and Node.js that provides real-time stock data, portfolio management, and market analysis tools.

## Features
### Stock Data
- **Real-time stock quotes**: Live price updates with market status indicators.
- **Historical price charts**: Interactive visualization of stock performance over customizable time periods.
- **Company information**: Comprehensive company profiles with key financial metrics.
- **News integration**: Latest financial news related to stocks and markets.

### User Features
- **Portfolio management**: Track investments with real-time performance metrics.
- **Watchlist tracking**: Monitor favorite stocks with customizable alerts.
- **Balance management**: Monitor available funds for trading activities.

## Project Structure

### Backend (`my-stock-app-backend/`)
```
my-stock-app-backend/
├── models/
│   ├── portfolio.model.js
│   ├── wallet.model.js
│   └── watch_list.model.js
├── server.js
├── package.json
└── app.yaml
```

### Frontend (`my-stock-app-frontend/`)
```
my-stock-app-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── summary/
│   │   │   ├── chart/
│   │   │   ├── insights/
│   │   │   ├── top-news/
│   │   │   ├── search-bar/
│   │   │   ├── company-profile/
│   │   │   └── buy-sell-model/
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── portfolio.service.ts
│   │   │   ├── summary.service.ts
│   │   │   └── watchlist.service.ts
│   │   └── app.routes.ts
│   ├── assets/
│   └── styles.css
├── package.json
└── angular.json
```

## Technologies Used
### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web application framework for creating API endpoints.
- **MongoDB**: NoSQL database for storing user and stock data.
- **Mongoose**: Object Data Modeling library for MongoDB.

### Frontend
- **Angular**: Component-based frontend framework.
- **TypeScript**: Typed superset of JavaScript for enhanced development.
- **Angular Material**: UI component library for modern design.
- **Chart.js**: JavaScript charting library for interactive visualizations.

### APIs
- **Finnhub API**: Source for real-time stock data and company information.
- **Polygon.io API**: Provider of historical market data with technical indicators.

## API Documentation

### Stock Endpoints
```
GET /search?symbol={symbol}
GET /api/quote?symbol={symbol}
```

### Portfolio Endpoints
```
GET /portfolio
POST /portfolio
PUT /portfolio/{id}
DELETE /portfolio/{id}
```

### Watchlist Endpoints
```
GET /watchlist
POST /watchlist
DELETE /watchlist/{symbol}
```