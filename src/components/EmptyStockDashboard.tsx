import React from 'react';

interface EmptySearchProps {
  message?: string;
}

const EmptyStockDashboard: React.FC<EmptySearchProps> = ({ message }) => {
  const defaultMessage = "Search for a stock to get started.";
  const displayMessage = message || defaultMessage;

  return (
    <div className="flex flex-col items-center justify-center py-6 flex-grow">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10 text-gray-400 mb-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <p className="text-gray-500 text-md font-light text-center">
        {displayMessage}
      </p>
      <p className="text-gray-400 text-sm font-light text-center mt-1">
        (Enter a stock symbol like AAPL, GOOG, TSLA)
      </p>
    </div>
  );
};

export default EmptyStockDashboard;