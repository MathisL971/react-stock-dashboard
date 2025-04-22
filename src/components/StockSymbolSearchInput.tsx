import { useEffect, useRef, useState } from "react";
import { StockExchangeCode } from "../types";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { deboundedSearchTermAtom, isDebouncingAtom, searchTermAtom, symbolsAtom } from "../atoms/dashboard";
import { useQueryClient } from "@tanstack/react-query";
import { getStockQuote } from "../services/stocks";
import { toast } from "sonner";
import useQueryParameters from "@/hooks/useQueryParameters";
import { Input } from "./ui/input";
import LoadingDots from "./utils/LoadingDots";

type StockSymbolSearchInputProps = {
    placeholder?: string
    exchangeCode: StockExchangeCode
    onSelect: (ticker: string) => void
}

export default function StockSymbolSearchInput(props: StockSymbolSearchInputProps) {
    const queryClient = useQueryClient();
    const searchTerm = useAtomValue(searchTermAtom);
    const setDebouncedSearchTerm = useSetAtom(deboundedSearchTermAtom);
    const [{ data: symbols = [], isLoading, error, failureCount }] = useAtom(symbolsAtom);
    const isDebouncing = useAtomValue(isDebouncingAtom);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const queryParams = useQueryParameters();

    useEffect(() => {
        setIsDropdownOpen(searchTerm !== '');
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef, dropdownRef]);

    useEffect(() => {
        if (error) {
            console.error(error);
            toast.error("An error occurred", { description: "It looks like we were not able to get the stock data. Refresh the page and try again." })
        };
    }, [error]);

    useEffect(() => {
        if (failureCount === 1) toast.error("Something's not right", { description: "Wait a few seconds while we try again." });
    }, [failureCount])

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!isDropdownOpen) return;

        if (event.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) => {
                const nextIndex = Math.min(prevIndex + 1, symbols.length - 1);
                if (listRef.current && listRef.current.children[nextIndex]) {
                    const highlightedItem = listRef.current.children[nextIndex] as HTMLElement;
                    const listHeight = listRef.current.offsetHeight;
                    const itemBottom = highlightedItem.offsetTop + highlightedItem.offsetHeight;
                    if (itemBottom > listHeight) {
                        highlightedItem.scrollIntoView({ block: 'end' });
                    }
                }
                return nextIndex;
            });
        } else if (event.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) => {
                const nextIndex = Math.max(prevIndex - 1, 0);
                if (listRef.current && listRef.current.children[nextIndex]) {
                    const highlightedItem = listRef.current.children[nextIndex] as HTMLElement;
                    const itemTop = highlightedItem.offsetTop;
                    // Check if the top of the item is above the visible scroll area
                    if (itemTop < listRef.current.scrollTop) {
                        highlightedItem.scrollIntoView({ block: 'start' });
                    }
                }
                return nextIndex;
            });
        } else if (event.key === 'Enter') {
            if (highlightedIndex >= 0 && highlightedIndex < symbols.length) {
                props.onSelect(symbols[highlightedIndex].symbol);
                // Add symbol to query params
                queryParams.set('ticker', symbols[highlightedIndex].symbol);
            }
        } else if (event.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="relative w-full">
            <Input
                ref={inputRef}
                className="bg-white"
                type="text"
                placeholder={props.placeholder ?? "Search..."}
                value={searchTerm}
                onChange={(e) => setDebouncedSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {if (!isDropdownOpen && searchTerm) setIsDropdownOpen(true)}}
            />
            {isDropdownOpen &&
                <div
                    ref={dropdownRef}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
                >
                    <ul
                        ref={listRef} 
                        className="max-h-60 overflow-auto focus:outline-none"
                    >
                        {symbols.map((s, i) => (
                            <li
                                key={s.symbol}
                                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                i === highlightedIndex ? 'bg-gray-100' : ''
                                }`}
                                onClick={() => {
                                    props.onSelect(s.symbol)
                                    queryParams.set('ticker', s.symbol)
                                    setDebouncedSearchTerm('')
                                }}
                                onMouseEnter={() => queryClient.prefetchQuery({
                                    queryKey: ['quote', s.symbol],
                                    queryFn: () => getStockQuote(s.symbol),
                                    staleTime: 60000
                                })}
                            >
                                {s.description}{' ('}{s.displaySymbol}{')'}
                            </li>
                        ))}
                        
                    </ul>
                    {searchTerm.length > 0 && symbols.length === 0 && (
                        <div className="px-4 py-2 text-gray-500 flex justify-center">
                            {isLoading || isDebouncing ? <LoadingDots /> : <p className="font-light">No stocks found</p>}
                        </div>
                    )}
                </div>
            }
        </div>
    )
}