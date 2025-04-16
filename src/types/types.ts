export type Stock = {
	currency: string;
	description: string;
	displaySymbol: string;
	figi: string;
	mic: string;
	symbol: string;
	type: string;
}

export type StockSymbol = {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
}

export type StockQuote = {
	c: number;
	h: number;
	l: number;
	o: number;
	pc: number;
	d: number;
	dp: number;
	t: number;
}

export type StockExchange = {
	name: string;
	code: StockExchangeCode;
	country: string;
	country_name: string;
}

export type StockExchangeCode = 'US' | 'L' | 'T' | 'SS' | 'HK' | 'XPAR' | 'TO' | 'SW' | 'KS' | 'DE' | 'ASX';

export type MarketStatus = {
	exchange: string;
	holiday: boolean;
	isOpen: boolean;
	session: string;
	timezone: string;
	t: number;
}