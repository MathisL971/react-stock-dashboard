import { useEffect, useRef, useState } from "react";
import StockSymbolSearchInput from "./StockSymbolSearchInput";
import StockDashboard from "./StockDashboard";
import { StockExchangeCode, StockSymbol } from "../types/types";
import StockExchangeSelector from "./StockExchangeSelector";

export default function StockSearchPage() {
    const [exchangeCode, setExchangeCode] = useState<StockExchangeCode>('US');
    const [symbol, setSymbol] = useState<StockSymbol | null>(null);

    const websocket = useRef<WebSocket | null>(null);
    
    useEffect(() => {
        websocket.current = new WebSocket('ws://localhost:8080'); // Note: 'ws://' for non-secure local development

        websocket.current.onopen = () => {
            console.log('WebSocket connection opened');
        };

        websocket.current.onclose = event => {
            console.log('WebSocket connection closed:', event.code, event.reason);
        };

        websocket.current.onmessage = event => {
            const message = event.data;
            console.log('Received message:', message);
        };

        websocket.current.onerror = error => {
            console.error('WebSocket error:', error);
        };
        
        return () => {
            if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
                console.log(`Closing WebSocket connection`);
                websocket.current.close();
            }
        };
    }, [])

    useEffect(() => {
        if (!symbol) return;

        if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
            websocket.current.send(JSON.stringify({ type: 'subscribe', symbol: symbol.symbol }));
        }
    }, [symbol]);

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