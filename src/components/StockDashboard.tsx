import { getStockQuote, getMarketStatus } from "../services/stocks";
import { StockExchangeCode, StockSymbol } from "../types/types";
import { useQuery } from "@tanstack/react-query";

export default function StockDashboard({
    exchangeCode,
    symbol
}: {
    exchangeCode: StockExchangeCode,
    symbol: StockSymbol
}) {
    const stockQuoteQuery = useQuery({
        queryKey: ['quote', symbol.symbol],
        queryFn: () => getStockQuote(symbol.symbol),
    });
    const marketStatusQuery = useQuery({
        queryKey: ['market-status', exchangeCode],
        queryFn: () => getMarketStatus(exchangeCode),
    });

    if (stockQuoteQuery.isLoading || marketStatusQuery.isLoading) {
        return <p>Loading...</p>;
    }

    if (stockQuoteQuery.isError || marketStatusQuery.isError) {
        if (stockQuoteQuery.error instanceof Error) {
            return <p>Error fetching stock quote: {stockQuoteQuery.error.message}</p>;
        }
        if (marketStatusQuery.error instanceof Error) {
            return <p>Error fetching market status: {marketStatusQuery.error.message}</p>;
        }
        return <p>Error fetching stock quote and market status</p>;
    }

    if (!stockQuoteQuery.data || !marketStatusQuery.data) {
        return <p>No data</p>;
    }
    
    const { c: current, h: high, l: low, o: open, pc: previousClose, d: change, dp: percentChange } = stockQuoteQuery.data;
    // const { holiday, isOpen, session } = marketStatusQuery.data;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <p className="text-gray-500 font-semibold text-md">{symbol.type}</p>
                <p className="font-bold text-4xl">{`${symbol.description} (${symbol.symbol})`}</p>
            </div>
            <hr className="border-gray-200" />
            <div className="flex flex-col">
                <p className="text-gray-500 font-semibold text-md">Current Price</p>
                <p className="font-bold text-3xl">{current}</p>
                {/* TODO: Add change and percent change */}
                <p className={change > 0 ? "text-green-500 font-semibold text-xl" : "text-red-500 font-semibold text-xl"}>
                    {`${change > 0 ? '+' : ''}${change} (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%)`}
                </p>            
            </div>
            {/* Price History */}
            <div className="flex flex-col w-full h-96 bg-gray-200 rounded">
                {/* TODO: Add price history chart */}
                <p className="text-gray-500 font-semibold text-md text-center my-auto">Price History</p>
            </div>

            {/* Additional Stock Information */}
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <p className="text-gray-500 font-semibold text-sm">Open</p>
                    <p className="font-bold text-lg">${open}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-gray-500 font-semibold text-sm">High</p>
                    <p className="font-bold text-lg">${high}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-gray-500 font-semibold text-sm">Low</p>
                    <p className="font-bold text-lg">${low}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-gray-500 font-semibold text-sm">Previous Close</p>
                    <p className="font-bold text-lg">${previousClose}</p>
                </div>
            </div>
        </div>
        
    );
}