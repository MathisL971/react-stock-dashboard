import { useCallback, useEffect } from "react";
import StockSymbolSearchInput from "./StockSymbolSearchInput";
import StockDashboard from "./StockDashboard";
import StockExchangeSelector from "./StockExchangeSelector";
import useWebSocket from "../hooks/useWebSocket";
import { useAtom } from "jotai";
import { exchangeCodeAtom, symbolAtom } from "../atoms/dashboard";

export default function StockSearchPage() {
    const [exchangeCode, setExchangeCode] = useAtom(exchangeCodeAtom);
    const [symbol, setSymbol] = useAtom(symbolAtom);

    const onOpen = useCallback((event: Event) => {
        console.log('WebSocket connection opened:', event);
    }, []);

    const onClose = useCallback((event: CloseEvent) => {
        console.log('WebSocket connection closed:', event);
    }, []);

    const onMessage = useCallback((event: MessageEvent) => {
        console.log('Received message:', event.data);
    }, []);

    const onError = useCallback((error: Event) => {
        console.error('WebSocket error:', error);
    }, []);

    const { isConnected, send } = useWebSocket({ onOpen, onClose, onMessage, onError });

    useEffect(() => {
        if (symbol && isConnected) send(JSON.stringify({'type':'subscribe', 'symbol': symbol.symbol}));
    }, [symbol, isConnected, send]);

    return (
        <div className="flex flex-col gap-2 flex-grow">
            <div className="flex flex-row gap-2">
                <StockExchangeSelector defaultExchangeCode={exchangeCode} onSelect={setExchangeCode} />
                <StockSymbolSearchInput exchangeCode={exchangeCode} onSelect={setSymbol} />
            </div>
            <hr className="text-gray-200" />
            {symbol 
                ? <StockDashboard exchangeCode={exchangeCode} symbol={symbol} /> 
                : <p className="text-gray-500 font-semibold text-md text-center my-auto">Enter a stock symbol to get started.</p>}
        </div>
    );
}