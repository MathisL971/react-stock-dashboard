import { createContext } from "react";
import { StockSymbol } from "../types/types";

export const SymbolContext = createContext<{
    symbol: StockSymbol | null;
    setSymbol: (symbol: StockSymbol) => void;
}>({
    symbol: null,
    setSymbol: () => {}
});