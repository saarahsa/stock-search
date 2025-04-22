const express = require('express');
const axios = require('axios');
const cors = require("cors");
const mongoose = require('mongoose');
const WatchList= require('./models/watch_list.model.js');
const Portfolio= require('./models/portfolio.model.js');
const Wallet= require('./models/wallet.model.js');

const app = express();
const port = parseInt(process.env.PORT) || 3000;

const corsOptions = {
    origin: "*",
    optionSuccessStatus: 200,
    credentials:true,
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Origin', 
        'x-access-token', 
        'XSRF-TOKEN'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

app.use(express.json());
app.use(cors(corsOptions));

const mongoURI = "mongodb+srv://saarahkhan9999:XpSJdw8cUrujLGdi@cluster0.1huzzuh.mongodb.net/stock_profile?retryWrites=true&w=majority";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const API_KEY = 'cnppo31r01qgjjvqu43gcnppo31r01qgjjvqu440';
const POLY_API_KEY='92LBYWeqIrdWNNt1wfkQiv2lUMxMaMEx';
  
function returnMarketStatus(epochTime) {
    const currentTime = new Date().getTime();
    const fiveMinutesInMilliseconds = 5 * 60 * 1000;
    const timeDifference = currentTime - (epochTime * 1000);

    if (timeDifference >= fiveMinutesInMilliseconds) {
        return 'closed';
      } else {
        return 'open';
      }
}
  

async function fetchPolygonData(symbol) {
    try {
        const today = new Date();
        const twoYearsAgoDate = new Date(today);
        twoYearsAgoDate.setFullYear(twoYearsAgoDate.getFullYear() - 2);
        const fromDate = twoYearsAgoDate.toISOString().split('T')[0];
        const to_date = today.toISOString().split('T')[0];

        const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDate}/${to_date}?apiKey=${POLY_API_KEY}`;
        const response = await axios.get(url);
        const data = response.data.results;
        return data;
    } catch (error) {
        console.error('Error fetching Polygon data:', error.message);
        throw error;
    }
}

async function fetchHourlyData(symbol, closedDate) {
    try {
        let toDate, fromDate;
        closedDate= closedDate*1000
        toDate = new Date(closedDate);
        const fromDateTimestamp = closedDate - (24 * 60 * 60*1000);
        fromDate = new Date(fromDateTimestamp);
        fromDate=fromDate.toISOString().split('T')[0];
        toDate=toDate.toISOString().split('T')[0];

        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${POLY_API_KEY}`);
        const data = response.data.results;
        return data;
    } catch (error) {
        console.error('Error fetching Polygon Hourly data:', error.message);
        throw error;
    }
}

async function fetchCompanyProfile(symbol) {
    try{
        const profileResponse = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
        const response = profileResponse.data;
        return response;
    }catch (error) {
        console.error('Error fetching Company Profile Data:', error.message);
        throw error;
    }
}

async function fetchQuote(symbol) {
    try{
        const quoteResponse= await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
        const response = quoteResponse.data;
        return response;
    }catch (error) {
        console.error('Error fetching Quote Data:', error.message);
        throw error;
    }
}

async function fetchRecommendation(symbol) {
    try{
        const recommendationResponse= await axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${API_KEY}`);
        const response = recommendationResponse.data;
        return response;
    }catch (error) {
        console.error('Error fetching Recommendation Data:', error.message);
        throw error;
    }
}

async function fetchNews(symbol) {
    try{
        const currentDate = new Date().toISOString().split('T')[0];
        const sixMonthsAgoDate = new Date();
        sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);
        const fromDate = sixMonthsAgoDate.toISOString().split('T')[0];

        const newsResponse= await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${currentDate}&token=${API_KEY}`);
        const response = newsResponse.data.filter(item => 
            item.image && item.url && item.headline && item.datetime
          ).slice(0, 20);
          return response;
    }catch (error) {
        console.error('Error fetching News Data:', error.message);
        throw error;
    }
}

async function fetchInsider(symbol) {
    try{
        const insiderResponse= await axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&token=${API_KEY}`);
        const response = insiderResponse.data.data;
        return response;
    }catch (error) {
        console.error('Error fetching Insider Data:', error.message);
        throw error;
    }
}

async function fetchPeers(symbol) {
    try{
        const peersResponse= await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${API_KEY}`)
        const response = peersResponse.data;
        return response;
    }catch (error) {
        console.error('Error fetching Peers Data:', error.message);
        throw error;
    }
}

async function fetchEarnings(symbol) {
    try{
        const earningsResponse= await axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${API_KEY}`)
        const response = earningsResponse.data.map(item => ({
            actual: item.actual !== null ? item.actual : 0,
            estimate: item.estimate !== null ? item.estimate : 0,
            period: item.period,
            quarter: item.quarter,
            surprise: item.surprise !== null ? item.surprise : 0,
            surprisePercent: item.surprisePercent !== null ? item.surprisePercent : 0,
            symbol: item.symbol,
            year: item.year
          }));
        return response;
    }catch (error) {
        console.error('Error fetching Earnings Data:', error.message);
        throw error;
    }
}

async function fetchBalance() {
    try{
        const wallet = Wallet.findOne();
        return wallet;
    }catch (error) {
        console.error('Error fetching BalanceData:', error.message);
        throw error;
    }
}


async function fetchData(symbol) {
    try {
        const companyProfile = await fetchCompanyProfile(symbol);
        if (companyProfile && Object.keys(companyProfile).length !== 0) {
            const [polygonData, quote, recommendation, news, insider, peers, earnings] = await Promise.all([
                fetchPolygonData(symbol),
                fetchQuote(symbol),
                fetchRecommendation(symbol),
                fetchNews(symbol),
                fetchInsider(symbol),
                fetchPeers(symbol),
                fetchEarnings(symbol),
            ]);
            const status = returnMarketStatus(quote.t);
            const hourlyData = await fetchHourlyData(symbol, quote.t);
            
            return {
                companyProfile,
                polygonData,
                quote,
                recommendation,
                news,
                insider,
                peers,
                earnings,
                status,
                hourlyData,
            };
        } else {
            return { dataNotFound: true };
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
}

app.get('/search', async (req, res) => {
    const symbol = req.query.symbol;
    try {
        const data = await fetchData(symbol);
        if (data.dataNotFound) {
            res.status(200).json({ dataNotFound: true });
        } else {
            console.log(data);
            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/quote', async (req, res) => {
    const symbol = req.query.symbol;
    try {
        const data = await fetchQuote(symbol);
        console.log(data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/autocomplete/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/search?q=${symbol}&token=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching search data:', error.message);
        res.status(500).json({ error: 'An error occurred' });
    }
});


app.get('/marketStatus', async(req,res)=>{
    const symbol = req.query.symbol;
    try{
        const quote = await fetchQuote(symbol);
        const status = returnMarketStatus(quote.t);
        console.log(status)
        res.json({status});
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/wallet', async (req, res) => {
    try {
        const data = await fetchBalance();
        const balance = data.balance;
        res.json({balance});
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
});

app.post('/api/watchlist', async (req,res) => {
    try{
        const watchlist = await WatchList.create(req.body);
        res.status(200).json(watchlist)
        console.log(watchlist);
    }catch(error) {
        res.status(500).json({message:error.message});
    }
});

app.delete('/api/watchlist/:ticker', async (req,res) => {
    try{
        const { ticker } = req.params;
        const watchlist = await WatchList.findOneAndDelete({name : ticker});
        if (!watchlist) {
            return res.status(404).json({message: "Watchlist item not found"});
        }
        return res.status(200).json({message : 'Product deleted successfully'});
    }catch(error) {
        res.status(500).json({message:error.message});
        return;
    }
});

app.get('/api/watchlist', async (req, res) => {
    try {
        const watchlist = await WatchList.find({});
        const combinedResponse = [];

        for (const item of watchlist) {
            const symbol = item.name;

            const profileResponse = await fetchCompanyProfile(symbol);
            const quoteResponse = await fetchQuote(symbol);

            const combinedData = {
                name: profileResponse.name,
                ticker: profileResponse.ticker,
                c: quoteResponse.c,
                d: quoteResponse.d,
                dp: quoteResponse.dp,
                h: quoteResponse.h,
                l: quoteResponse.l,
                o: quoteResponse.o,
                pc: quoteResponse.pc,
            };

            combinedResponse.push(combinedData);
        }

        res.status(200).json(combinedResponse);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
});

app.post('/api/portfolio', async (req,res) => {
    try{
        const portfolio = await Portfolio.create(req.body);
        const wallet = await Wallet.findOne();
        const totalCost = req.body.totalCost;
        const newBalance = wallet.balance - totalCost;
        await Wallet.updateOne({}, { balance: newBalance });
        res.status(200).json(portfolio)
        console.log(portfolio);
        return;
    }catch(error) {
        res.status(500).json({message:error.message});
        return;
    }
});

app.put('/api/portfolio/:ticker', async (req, res) => {
    try {
        const { ticker } = req.params;
        const portfolio = await Portfolio.findOne({ name: ticker });
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio item not found" });
        }
        portfolio.totalCost += req.body.totalCost;
        portfolio.quantity += req.body.quantity;
        const updatedPortfolio = await portfolio.save();
        const wallet = await Wallet.findOne();
        const newBalance = wallet.balance - req.body.totalCost;
        await Wallet.updateOne({}, { balance: newBalance });

        res.status(200).json(updatedPortfolio);
        console.log(updatedPortfolio);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
});

app.delete('/api/portfolio/:ticker', async (req,res) => {
    try{
        const { ticker } = req.params;
        const portfolio = await Portfolio.findOneAndDelete({name : ticker});
        if (!portfolio) {
            return res.status(404).json({message: "Portfolio item not found"});
        }
        const totalCost = portfolio.totalCost;
        const wallet = await Wallet.findOne();
        const newBalance = wallet.balance + totalCost;
        await Wallet.updateOne({}, { balance: newBalance });

        return res.status(200).json({message : 'Porfolio deleted successfully'});
    }catch(error) {
        res.status(500).json({message:error.message});
        return;
    }
});

app.get('/api/portfolio', async (req, res) => {
    try {
        const portfolio = await Portfolio.find({});
        const combinedResponse = [];

        for (const item of portfolio) {
            const symbol = item.name;
            const quantity = item.quantity;
            const totalCost = item.totalCost;
            const walletMoney = await fetchBalance(); 
            const balance = walletMoney.balance;


            const profileResponse = await fetchCompanyProfile(symbol);
            const quoteResponse = await fetchQuote(symbol);

            const combinedData = {
                name: profileResponse.name,
                ticker: profileResponse.ticker,
                quantity: quantity,
                totalCost: totalCost,
                walletMoney: balance,
                c: quoteResponse.c,
                d: quoteResponse.d,
                dp: quoteResponse.dp,
                h: quoteResponse.h,
                l: quoteResponse.l,
                o: quoteResponse.o,
                pc: quoteResponse.pc,
            };

            combinedResponse.push(combinedData);
        }
        console.log(combinedResponse);
        res.status(200).json(combinedResponse);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});