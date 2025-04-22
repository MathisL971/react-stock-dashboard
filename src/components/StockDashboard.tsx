import { StockExchangeCode } from "../types";
import MarketStatus from "./MarketStatus";
import ChartWidget from "./ChartWidget";
import StatisticsWidget from "./StatisticsWidget";
import StockPriceWidget from "./StockPriceWidget";
import { useQuery } from "@tanstack/react-query";
import { getSymbol } from "@/services/stocks";
import { toast } from "sonner";
import LoadingDots from "./utils/LoadingDots";

export default function StockDashboard({
    exchangeCode,
    ticker
}: {
    exchangeCode: StockExchangeCode,
    ticker: string
}) {
    const { data: symbol, isLoading, isError, error } = useQuery({
        queryKey: ['symbol', exchangeCode, ticker],
        queryFn: () => getSymbol(exchangeCode, ticker),
    });

    if (isLoading) return <LoadingDots />;
    if (isError || !symbol) {
        if (error) console.error(error);
        toast("An error occurred", { description: "It looks like we were not able to get the stock data. Refresh the page and try again." })
        return;
    }
    
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <MarketStatus exchangeCode={exchangeCode} />
                <p className="font-bold text-4xl">{`${symbol.description} (${symbol.symbol})`}</p>                
                <p className="text-gray-400 text-md">{symbol.type}</p>
            </div>
            <hr className="border-gray-200" />
            <StockPriceWidget ticker={ticker} exchangeCode={exchangeCode} />            
            <ChartWidget />
            <StatisticsWidget ticker={ticker} />
        </div>
    );
}