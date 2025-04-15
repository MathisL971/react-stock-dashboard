import { useEffect, useRef } from "react";
import { StockSymbol } from "../types/types";

export default function StockDashboard({
    symbol
}: {
    symbol: StockSymbol | null
}) {
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

    if (!symbol) return <p className="text-gray-500 font-semibold text-md text-center my-auto">Enter a stock symbol to get started.</p>       

    return (
        <div className="flex flex-col">
            <p className="text-gray-500 font-semibold text-md">{symbol.type}</p>
            <p className="font-bold text-3xl">{`${symbol.description} (${symbol.symbol})`}</p>
        </div> 
    );
}