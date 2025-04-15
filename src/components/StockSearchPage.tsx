import { useState } from "react";
import StockSymbolSearchInput from "./StockSymbolSearchInput";
import StockDashboard from "./StockDashboard";
import { StockSymbol } from "../types/types";

export default function StockSearchPage() {
    const [symbol, setSymbol] = useState<StockSymbol | null>(null);
    
    return (
        <div className="flex flex-col gap-2 flex-grow">
            <StockSymbolSearchInput onSelect={setSymbol} />
            <hr className="text-gray-200" />
            <StockDashboard symbol={symbol} />
        </div>
    );
}