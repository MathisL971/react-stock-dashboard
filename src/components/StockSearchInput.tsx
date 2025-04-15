import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stock, StockIndex } from '../App';
import { debounce } from 'lodash';

interface SearchInputProps {
  placeholder?: string;
  query?: string;
  options: StockIndex;
  onSelect: (option: Stock) => void;
}

const DEBOUNCE_DELAY = 300; // milliseconds

const StockSearchInput: React.FC<SearchInputProps> = ({ placeholder = 'Search...', query = '', options, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState(query);
  const [filteredOptions, setFilteredOptions] = useState<Stock[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // const [searchIndex, setSearchIndex] = useState<Map<string, Stock[]>>(new Map());

  // useEffect(() => {
  //   const index = new Map<string, Stock[]>();

  //   for (const option of options) {
  //     const lowerLabel = option.description.toLowerCase();
  //     let prefix = "";

  //     for (let i = 0; i < lowerLabel.length; i++) {
  //       prefix += lowerLabel[i]; // Faster than substring
  //       if (!index.has(prefix)) {
  //         index.set(prefix, []);
  //       }
  //       index.get(prefix)!.push(option);
  //     }
  //   }

  //   setSearchIndex(index);
  // }, [options]);
  
  const filterOptionsWithIndex = useCallback((term: string) => {
    const lowerTerm = term.toLowerCase();
    const results = options.get(lowerTerm) || [];
    setFilteredOptions(results);
    setIsDropdownOpen(results.length > 0 && term.length > 0);
    setHighlightedIndex(-1);
  }, [options]);
  
  const debouncedFilter = useCallback(debounce(filterOptionsWithIndex, DEBOUNCE_DELAY), [filterOptionsWithIndex]);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    debouncedFilter(newSearchTerm);
  };

  const handleOptionSelect = (option: Stock) => {
    setSearchTerm(option.symbol);
    onSelect(option);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isDropdownOpen || filteredOptions.length === 0) return;

    if (event.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) => {
        const nextIndex = Math.min(prevIndex + 1, filteredOptions.length - 1);
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
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleOptionSelect(filteredOptions[highlightedIndex]);
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
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={options.size === 0}
      />

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <ul ref={listRef} className="max-h-60 overflow-auto focus:outline-none">
            {filteredOptions.map((option, index) => (
              <li
                key={option.symbol}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  index === highlightedIndex ? 'bg-indigo-100 text-indigo-700' : ''
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option.description}{' ('}{option.displaySymbol}{')'}
              </li>
            ))}
            {filteredOptions.length === 0 && searchTerm.length > 0 && (
              <li className="px-4 py-2 text-gray-500">No matches found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StockSearchInput;