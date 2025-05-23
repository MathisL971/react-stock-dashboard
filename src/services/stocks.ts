import { MarketStatus, StockExchangeCode, StockQuote, StockSymbol } from "../types";
import axios from "axios";

export async function getSymbols(exchangeCode: StockExchangeCode, searchTerm: string): Promise<StockSymbol[]> {
    const response = await axios.get(`http://localhost:8787/api/stock/lookup?query=${searchTerm}&exchange=${exchangeCode}`);
    return response.data.result;
}

export async function getSymbol(exchangeCode: StockExchangeCode, ticker: string): Promise<StockSymbol> {
    const response = await axios.get(`http://localhost:8787/api/stocks?ticker=${ticker}&exchange=${exchangeCode}`);
    return response.data;
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
    const response = await axios.get(`http://localhost:8787/api/stock/quote?symbol=${symbol}`);
    return response.data;
}

export async function getMarketStatus(exchangeCode: StockExchangeCode): Promise<MarketStatus> {
    const response = await axios.get(`http://localhost:8787/api/market-status?exchange=${exchangeCode}`);
    return response.data;   
}