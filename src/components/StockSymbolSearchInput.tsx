import { useEffect, useRef, useState } from "react";
import { StockExchangeCode, StockSymbol } from "../types";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { deboundedSearchTermAtom, isDebouncingAtom, searchTermAtom, symbolsAtom } from "../atoms/dashboard";

type StockSymbolSearchInputProps = {
    placeholder?: string
    exchangeCode: StockExchangeCode
    onSelect: (symbol: StockSymbol) => void
}

export default function StockSymbolSearchInput(props: StockSymbolSearchInputProps) {
    const searchTerm = useAtomValue(searchTermAtom);
    const setDebouncedSearchTerm = useSetAtom(deboundedSearchTermAtom);
    const [{ data: symbols = [], isLoading, isError, error  }] = useAtom(symbolsAtom);
    const isDebouncing = useAtomValue(isDebouncingAtom);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        setIsDropdownOpen(searchTerm !== '');
    }, [searchTerm]);

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
                props.onSelect(symbols[highlightedIndex]);
            }
        } else if (event.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };
    
    // Close dropdown when clicking outside
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

    return (
        <div className="relative w-full md:w-96">
            {isError &&<div className="text-red-500 text-xs mt-2">{error.message}</div>}
            <input
                ref={inputRef}
                type="text"
                placeholder={props.placeholder ?? "Search..."}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                i === highlightedIndex ? 'bg-indigo-100 text-indigo-700' : ''
                                }`}
                                onClick={() => {
                                    props.onSelect(s)
                                    setDebouncedSearchTerm('')
                                }}
                            >
                                {s.description}{' ('}{s.displaySymbol}{')'}
                            </li>
                        ))}
                        {symbols.length === 0 && searchTerm.length > 0 && (
                            <li className="px-4 py-2 text-gray-500">{isLoading || isDebouncing ? 'Loading...' : 'No results found'}</li>
                        )}
                    </ul>
                </div>
            }
        </div>
    )
}