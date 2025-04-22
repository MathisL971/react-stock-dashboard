import { useEffect, useState } from 'react';

export default function NotFound() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-center flex-grow">
      <div className="bg-white rounded-xl shadow-md p-12 max-w-md">
        <div className="flex justify-center items-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-gray-500 animate-bounce"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-700 tracking-tight mb-4">
          Oops!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We couldn't find the page you were looking for
          {dots}
        </p>
        <a
          href="/"
          className="inline-block bg-gray-500 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300"
        >
          Go Back Home
        </a>
        <div className="mt-8 text-sm text-gray-500">
          Maybe a different path?
        </div>
      </div>
    </div>
  );
}