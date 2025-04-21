import { getStockQuote } from "@/services/stocks";
import { StockSymbol } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function StatisticsWidget({
    symbol
}: {
    symbol: StockSymbol
}) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['quote', symbol.symbol],
        queryFn: () => getStockQuote(symbol.symbol),
    });

    if (isLoading) return;
    if (isError || !data) {
        if (error) console.error(error);
        toast("An error occurred", { description: "It looks like we were not able to get the stock data. Refresh the page and try again." });
        return;
    }

    const { h: high, l: low, o: open, pc: previousClose } = data;

    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-col">
                <p className="text-gray-400 text-sm">Open</p>
                <p className="font-bold text-lg">${open}</p>
            </div>
            <div className="flex flex-col">
                <p className="text-gray-400 text-sm">High</p>
                <p className="font-bold text-lg">${high}</p>
            </div>
            <div className="flex flex-col">
                <p className="text-gray-400 text-sm">Low</p>
                <p className="font-bold text-lg">${low}</p>
            </div>
            <div className="flex flex-col">
                <p className="text-gray-400 text-sm">Previous Close</p>
                <p className="font-bold text-lg">${previousClose}</p>
            </div>
        </div>
    );
}