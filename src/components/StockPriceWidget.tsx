import { currentPriceBgColorAtom, realTimeQuoteAtom } from "@/atoms/dashboard";
import { getMarketStatus, getStockQuote } from "@/services/stocks";
import { StockExchangeCode } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";

export default function StockPriceWidget({
    ticker,
    exchangeCode
}: {
    ticker: string
    exchangeCode: StockExchangeCode
}) {
    const marketStatus = useQuery({
        queryKey: ['market-status', exchangeCode],
        queryFn: () => getMarketStatus(exchangeCode),
    })
    const quote = useQuery({
        queryKey: ['quote', ticker],
        queryFn: () => getStockQuote(ticker),
    })

    const [currentPriceBgColor, setCurrentPriceBgColor] = useAtom(currentPriceBgColorAtom);
    const [realTimeQuote, setRealTimeQuote] = useAtom(realTimeQuoteAtom);

    useEffect(() => {
        if (quote.data) setRealTimeQuote({
            ...quote.data,
        });
    }, [quote.data, setRealTimeQuote]);

    useEffect(() => {
        if (currentPriceBgColor) {
            setTimeout(() => {
                setCurrentPriceBgColor(null);
            }, 500);
        }  
    }, [currentPriceBgColor, setCurrentPriceBgColor]);

    if (marketStatus.isLoading || quote.isLoading) return;
    if (marketStatus.isError || quote.isError) {
        toast("Something's not right", { description: "An error occured. Refresh the page and try again." });
        return;
    }
    if (!marketStatus.data || !quote.data) return;

    const { c: current, d: change, dp: percentChange } = realTimeQuote === null ? quote.data : realTimeQuote;
    const { isOpen, session } = marketStatus.data;

    return (
        <div className="flex flex-row gap-5">
            <div className="flex flex-col">
                <p className={`text-gray-400 text-lg`}>{isOpen ? "Current Price" : "At Close"}</p>
                <span>
                    {
                        currentPriceBgColor 
                            ? (
                                currentPriceBgColor === 'green' 
                                    ? <p className='font-bold text-3xl w-fit p-1 bg-green-200 rounded'>{current.toFixed(2)}</p>
                                    : <p className='font-bold text-3xl w-fit p-1 bg-red-200 rounded'>{current.toFixed(2)}</p>
                            ) 
                            : <p className='font-bold text-3xl w-fit p-1'>{current.toFixed(2)}</p>
                    }
                </span>
                <p className={change > 0 ? "text-green-500 font-semibold text-xl" : "text-red-500 font-semibold text-xl"}>
                    {`${change > 0 ? '+' : ''}${change.toFixed(2)} (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%)`}
                </p>            
            </div>
            {session && !isOpen && (
                <div className="flex flex-col">
                    <p className="text-gray-400 text-lg">{session.slice(0, 1).toUpperCase() + session.slice(1)}</p>
                    <p className="font-bold text-3xl">{current}</p>
                    <p className={change > 0 ? "text-green-500 font-semibold text-xl" : "text-red-500 font-semibold text-xl"}>
                        {`${change > 0 ? '+' : ''}${change} (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%)`}
                    </p>            
                </div>
            )}
        </div>
    );
}