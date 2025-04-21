import { atom } from "jotai";
import { StockExchangeCode, StockQuote } from "../types";
import { atomWithQuery } from "jotai-tanstack-query";
import { getMarketStatus, getSymbols } from "../services/stocks";
import atomWithDebounce from "./utils/atomWithDebounce";

export const exchangeCodeAtom = atom<StockExchangeCode>('US');
export const marketStatusAtom = atomWithQuery((get) => ({
    queryKey: ['market-status', get(exchangeCodeAtom)],
    queryFn: () => getMarketStatus(get(exchangeCodeAtom)),
    enabled: !!get(exchangeCodeAtom),
}));

export const tickerAtom = atom<string>('');

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
}));

export const realTimeQuoteAtom = atom<StockQuote | null>(null);
export const currentPriceBgColorAtom = atom<string | null>(null);
