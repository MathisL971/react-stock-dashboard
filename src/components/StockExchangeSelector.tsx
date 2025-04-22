import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { StockExchange, StockExchangeCode } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { getMarketStatus } from "@/services/stocks"

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
}: {
    defaultExchangeCode?: StockExchangeCode, 
    onSelect: (exchangeCode: StockExchangeCode) => void
}) {
  const [selected, setSelected] = React.useState(defaultExchangeCode)
  const [open, setOpen] = React.useState(false)

  useQuery({
    queryKey: ['market-status', defaultExchangeCode],
    queryFn: () => getMarketStatus(defaultExchangeCode),
    notifyOnChangeProps: [],
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selected
            ? exchanges.find((exchange) => exchange.code === selected)?.name
            : "Select exchange..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No exchange found.</CommandEmpty>
            <CommandGroup>
              {exchanges.map((exchange) => (
                <CommandItem
                  key={exchange.code}
                  value={exchange.code}
                  onSelect={(currentValue) => {
                    onSelect(currentValue as StockExchangeCode)
                    setSelected(currentValue as StockExchangeCode)
                    setOpen(false)
                  }}
                  disabled={exchange.code !== 'US'}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === exchange.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {exchange.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
