import { useCallback, useEffect, useRef, useState } from "react";
import { StockSymbol } from "../types/types";

type StockSymbolSearchInputProps = {
    placeholder?: string
    searchTerm?: string
    onSelect: (symbol: StockSymbol) => void
}

export default function StockSymbolSearchInput(props: StockSymbolSearchInputProps) {
    const [searchTerm, setSearchTerm] = useState(props.searchTerm ?? "");
    const [symbols, setSymbols] = useState<StockSymbol[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const lookupStock = useCallback(async (query: string) => {
        if (!query) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8787/api/stock/lookup?query=${query}&exchange=US`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.count !== 0) setSymbols(data.result);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (searchTerm.length === 0) {
            setSymbols([]);
            setIsDropdownOpen(false);
            return;
        }

        if (!isDropdownOpen) {
            setIsDropdownOpen(true);
        }

        lookupStock(searchTerm);
    }, [searchTerm]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!isDropdownOpen) return;

        if (event.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) => {
            const nextIndex = Math.min(prevIndex + 1, symbols.length - 1);
            if (listRef.current && listRef.current.children[nextIndex]) {
                const highlightedItem = listRef.current.children[nextIndex];
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
                const highlightedItem = listRef.current.children[nextIndex];
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
            {
                error &&
                <div className="text-red-500 text-xs mt-2">{error}</div>
            }
            <input
                ref={inputRef}
                type="text"
                placeholder={props.placeholder ?? "Search..."}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (!isDropdownOpen && searchTerm) setIsDropdownOpen(true);
                }}
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
                                    setSearchTerm('')
                                }}
                            >
                                {s.description}{' ('}{s.displaySymbol}{')'}
                            </li>
                        ))}
                        {symbols.length === 0 && searchTerm.length > 0 && (
                            <li className="px-4 py-2 text-gray-500">{loading ? 'Loading...' : 'No results found'}</li>
                        )}
                    </ul>
                </div>
            }
        </div>
    )
}