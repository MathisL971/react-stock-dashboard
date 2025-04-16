import { StockExchange, StockExchangeCode } from "../types/types"

const exchanges: StockExchange[] = [
    { name: "NYSE/NASDAQ", country: "US", country_name: "US", code: "US" },
    { name: "LONDON STOCK EXCHANGE", country: "GB", country_name: "UK", code: "L" },
    { name: "TOKYO STOCK EXCHANGE", country: "JP", country_name: "Japan", code: "T" },
    { name: "SHANGHAI STOCK EXCHANGE", country: "CN", country_name: "China", code: "SS" },
    { name: "HONG KONG EXCHANGES", country: "HK", country_name: "Hong Kong", code: "HK" },
    { name: "EURONEXT", country: "EU", country_name: "Europe", code: "XPAR" }, // Euronext is a pan-European exchange
    { name: "TORONTO STOCK EXCHANGE", country: "CA", country_name: "Canada", code: "TO" },
    { name: "SWISS EXCHANGE", country: "CH", country_name: "Switzerland", code: "SW" },
    { name: "KOREA EXCHANGE", country: "KR", country_name: "Korea", code: "KS" },
    { name: "DEUTSCHE BOERSE AG", country: "DE", country_name: "Germany", code: "DE" },
    { name: "AUSTRALIAN SECURITIES EXCHANGE", country: "AU", country_name: "Australia", code: "ASX" }, // Using a common abbreviation
];

export default function StockExchangeSelector({ 
        defaultExchangeCode = 'US', 
        onSelect, 
    } : { 
        defaultExchangeCode?: StockExchangeCode, 
        onSelect: (exchangeCode: StockExchangeCode) => void
    }
) {
    return (
        <select
            onChange={(event) => onSelect(event.target.value as StockExchangeCode)}
            value={defaultExchangeCode}
            name="exchange"
            id="exchange"
            className="px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            {exchanges.map((exchange) => (
                <option key={exchange.name} value={exchange.code}>
                    {exchange.name}
                </option>
            ))}
        </select>
    )
}