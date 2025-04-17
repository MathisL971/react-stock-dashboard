import { atom } from "jotai";
import { StockExchangeCode, StockSymbol } from "../types";
import { atomWithQuery } from "jotai-tanstack-query";
import { getMarketStatus, getStockQuote, getSymbols } from "../services/stocks";
import atomWithDebounce from "./utils/atomWithDebounce";

export const exchangeCodeAtom = atom<StockExchangeCode>('US');

export const {
    isDebouncingAtom,
    debouncedValueAtom: deboundedSearchTermAtom,
    clearTimeoutAtom,
    currentValueAtom: searchTermAtom,
} = atomWithDebounce('');
export const symbolsAtom = atomWithQuery((get) => ({
    queryKey: ['symbols', get(exchangeCodeAtom), get(deboundedSearchTermAtom)],
    queryFn: () => getSymbols(get(exchangeCodeAtom), get(deboundedSearchTermAtom)),
    enabled: !!get(exchangeCodeAtom) && !!get(deboundedSearchTermAtom),
}))
export const symbolAtom = atom<StockSymbol | null>(null);
export const quoteAtom = atomWithQuery((get) => ({
    queryKey: ['quote', get(symbolAtom)!.symbol],
    queryFn: () => getStockQuote(get(symbolAtom)!.symbol),
    enabled: !!get(symbolAtom),
}));
export const marketStatusAtom = atomWithQuery((get) => ({
    queryKey: ['market-status', get(exchangeCodeAtom)],
    queryFn: () => getMarketStatus(get(exchangeCodeAtom)),
    enabled: !!get(exchangeCodeAtom),
}));