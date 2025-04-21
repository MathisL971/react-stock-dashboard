import { StockExchangeCode, StockSymbol } from "../types";
import MarketStatus from "./MarketStatus";
import ChartWidget from "./ChatWidget";
import StatisticsWidget from "./StatisticsWidget";
import StockPriceWidget from "./StockPriceWidget";

export default function StockDashboard({
    exchangeCode,
    symbol
}: {
    exchangeCode: StockExchangeCode,
    symbol: StockSymbol
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <MarketStatus exchangeCode={exchangeCode} />
                <p className="font-bold text-4xl">{`${symbol.description} (${symbol.symbol})`}</p>                
                <p className="text-gray-400 text-md">{symbol.type}</p>
            </div>
            <hr className="border-gray-200" />
            <StockPriceWidget />            
            <ChartWidget />
            <StatisticsWidget symbol={symbol} />
        </div>
    );
}