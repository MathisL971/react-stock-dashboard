import { MarketStatus, StockExchangeCode, StockQuote } from "../types/types";
import axios from "axios";

export async function getStockQuote(symbol: string): Promise<StockQuote> {
    const response = await axios.get(`http://localhost:8787/api/stock/quote?symbol=${symbol}`);
    return response.data;
}

export async function getMarketStatus(exchangeCode: StockExchangeCode): Promise<MarketStatus> {
    const response = await axios.get(`http://localhost:8787/api/market-status?exchange=${exchangeCode}`);
    return response.data;   
}