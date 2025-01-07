import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SymbolPriceInputProps {
  onSymbolChange: (symbol: string) => void;
  onPriceChange: (price: string) => void;
  symbol: string;
  price: string;
}

const SUPPORTED_SYMBOLS = [
  { value: "XAUUSD", label: "الذهب/دولار" },
  { value: "EURUSD", label: "يورو/دولار" },
  { value: "GBPUSD", label: "جنيه/دولار" },
  { value: "USDJPY", label: "دولار/ين" },
  { value: "USDCHF", label: "دولار/فرنك" },
  { value: "AUDUSD", label: "دولار استرالي/دولار" },
  { value: "NZDUSD", label: "دولار نيوزيلندي/دولار" },
  { value: "USDCAD", label: "دولار/دولار كندي" },
  { value: "BTCUSD", label: "بيتكوين/دولار" },
  { value: "ETHUSD", label: "إيثريوم/دولار" }
];

export const SymbolPriceInput = ({ 
  onSymbolChange, 
  onPriceChange,
  symbol,
  price
}: SymbolPriceInputProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رمز العملة أو الزوج
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {symbol
                ? SUPPORTED_SYMBOLS.find((s) => s.value === symbol)?.label
                : "اختر رمز العملة أو الزوج"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="ابحث عن رمز العملة..." />
              <CommandEmpty>لم يتم العثور على رمز العملة</CommandEmpty>
              <CommandGroup>
                {SUPPORTED_SYMBOLS.map((symbol) => (
                  <CommandItem
                    key={symbol.value}
                    value={symbol.value}
                    onSelect={(currentValue) => {
                      onSymbolChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        symbol.value === symbol ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {symbol.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          السعر (إجباري)
        </label>
        <Input
          type="number"
          step="any"
          placeholder="أدخل السعر (إجباري)"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          className="w-full"
          dir="ltr"
        />
      </div>
    </div>
  );
};