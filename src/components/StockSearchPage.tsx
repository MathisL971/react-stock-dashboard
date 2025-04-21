import { useCallback, useEffect } from "react";
import StockSymbolSearchInput from "./StockSymbolSearchInput";
import StockDashboard from "./StockDashboard";
import StockExchangeSelector from "./StockExchangeSelector";
import useWebSocket from "../hooks/useWebSocket";
import { useAtom, useSetAtom  } from "jotai";
import { currentPriceBgColorAtom, exchangeCodeAtom, realTimeQuoteAtom, tickerAtom } from "../atoms/dashboard";
import { StockExchangeCode } from "@/types";
import useQueryParameters from "@/hooks/useQueryParameters";

export default function StockSearchPage() {
    const [exchangeCode, setExchangeCode] = useAtom(exchangeCodeAtom);
    const [ticker, setTicker] = useAtom(tickerAtom);
    const setRealTimeQuote = useSetAtom(realTimeQuoteAtom);
    const setCurrentPriceBgColor = useSetAtom(currentPriceBgColorAtom);
    const queryParams = useQueryParameters();

    const onOpen = useCallback((event: Event) => {
        console.log('WebSocket connection opened:', event);
    }, []);

    const onClose = useCallback((event: CloseEvent) => {
        console.log('WebSocket connection closed:', event);
    }, []);

    const onMessage = useCallback((event: MessageEvent) => {        
        if (typeof event.data !== 'string') {
            console.error('Received non-string data:', event.data);
            return;
        }

        const data = JSON.parse(event.data);

        if (data.type === 'price_update') {
            setRealTimeQuote((prevRealTimeQuote) => {
                if (!prevRealTimeQuote) return null;

                const newPrice = Math.round(data.price * 100) / 100;

                if (newPrice > prevRealTimeQuote.c) setCurrentPriceBgColor('green');
                else if (newPrice < prevRealTimeQuote.c) setCurrentPriceBgColor('red');
                else setCurrentPriceBgColor(null);
                
                return {
                    ...prevRealTimeQuote,
                    c: newPrice,
                    h: prevRealTimeQuote.h > newPrice ? prevRealTimeQuote.h : newPrice,
                    l: prevRealTimeQuote.l < newPrice ? prevRealTimeQuote.l : newPrice,
                    dp: (newPrice / prevRealTimeQuote.pc - 1) * 100,
                    d: newPrice - prevRealTimeQuote.pc,
                    t: data.t
                }
            });
        }
    }, [setRealTimeQuote, setCurrentPriceBgColor]);

    const onError = useCallback((error: Event) => {
        console.error('WebSocket error:', error);
    }, []);

    const { isConnected, send } = useWebSocket({ onOpen, onClose, onMessage, onError });

    useEffect(() => {
        if (ticker && isConnected) send(JSON.stringify({'type':'subscribe', 'symbol': ticker}));
    }, [ticker, isConnected, send]);
    
    useEffect(() => {
        if (queryParams.has('ticker')) setTicker(queryParams.get('ticker') as string);
        if (queryParams.has('exchange')) setExchangeCode(queryParams.get('exchange') as StockExchangeCode);
    }, [queryParams, setTicker, setExchangeCode]);

    return (
        <div className="flex flex-col gap-2 flex-grow">
            <div className="flex flex-row gap-2">
                <StockExchangeSelector defaultExchangeCode={exchangeCode} onSelect={setExchangeCode} />
                <StockSymbolSearchInput exchangeCode={exchangeCode} onSelect={setTicker} />
            </div>
            <hr className="text-gray-200" />
            {ticker 
                ? <StockDashboard exchangeCode={exchangeCode} ticker={ticker} /> 
                : <p className="text-gray-500 font-semibold text-md text-center my-auto">Enter a stock symbol to get started.</p>}
        </div>
    );
}