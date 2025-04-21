import { marketStatusAtom, quoteAtom } from "@/atoms/dashboard";
import { useAtomValue } from "jotai";
import { toast } from "sonner";

export default function StockPriceWidget() {
    const marketStatus = useAtomValue(marketStatusAtom);
    const quote = useAtomValue(quoteAtom)

    if (marketStatus.isLoading || quote.isLoading) return;
    if (marketStatus.isError || quote.isError) {
        toast("Something's not right", { description: "An error occured. Refresh the page and try again." });
        return;
    }
    if (!marketStatus.data || !quote.data) return;

    const { c: current, d: change, dp: percentChange } = quote.data;
    const { isOpen, session } = marketStatus.data;

    return (
        <div className="flex flex-row gap-5">
            <div className="flex flex-col">
                <p className="text-gray-400 text-lg">{isOpen ? "Current Price" : "At Close"}</p>
                <p className="font-bold text-3xl">{current}</p>
                <p className={change > 0 ? "text-green-500 font-semibold text-xl" : "text-red-500 font-semibold text-xl"}>
                    {`${change > 0 ? '+' : ''}${change} (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%)`}
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