import { getMarketStatus } from "@/services/stocks";
import { StockExchangeCode } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export default function MarketStatus({
    exchangeCode
}: { 
    exchangeCode: StockExchangeCode 
}) {
    const { data, isLoading, error, failureCount } = useQuery({
        queryKey: ['market-status', exchangeCode],
        queryFn: () => getMarketStatus(exchangeCode),
    });

    useEffect(() => {
        if (error || !data) {
            console.error(error);
            toast.error("An error occurred", { description: "It looks like we were not able to get market data. Refresh the page and try again." })
        };
    }, [error, data]);

    useEffect(() => {
        if (failureCount === 1) toast.error("Something's not right", { description: "Wait a few seconds while we try again." });
    }, [failureCount])

    if (isLoading || error || !data) return;

    const { holiday, isOpen, session, timezone } = data;

    return (
        <div className="flex flex-row text-gray-400 text-sm items-center gap-1 pl-1">
            {isOpen ? <div className="animate-pulse w-2.5 h-2.5 bg-green-500 rounded-full"></div> : <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>}
            {`${exchangeCode} (${timezone}) • 
                ${session ? session.slice(0, 1).toUpperCase() + session.slice(1) + ' Session' : 'Closed'}
                ${holiday ? ' for ' + holiday : ''}
            `}
        </div>
    );
}