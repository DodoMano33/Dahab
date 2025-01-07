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
import { Check, ChevronsUpDown, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SymbolPriceInputProps {
  onSymbolChange: (symbol: string) => void;
  onPriceChange: (price: string) => void;
  onAutoAnalysis?: () => void;
  symbol: string;
  price: string;
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
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
  onAutoAnalysis,
  symbol,
  price,
  selectedTimeframes,
  selectedInterval,
  selectedAnalysisTypes
}: SymbolPriceInputProps) => {
  const [open, setOpen] = useState(false);

  const handleSymbolSelect = (value: string) => {
    console.log("Symbol selected:", value);
    onSymbolChange(value);
    setOpen(false);
  };

  const handleStartAutoAnalysis = () => {
    if (!symbol) {
      toast.error("الرجاء اختيار رمز العملة");
      return;
    }

    if (!price) {
      toast.error("الرجاء إدخال السعر الحالي");
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }

    if (selectedTimeframes.length === 0) {
      toast.error("الرجاء اختيار إطار زمني واحد على الأقل");
      return;
    }

    if (!selectedInterval) {
      toast.error("الرجاء اختيار مدة التحليل");
      return;
    }

    if (selectedAnalysisTypes.length === 0) {
      toast.error("الرجاء اختيار نوع تحليل واحد على الأقل");
      return;
    }

    console.log("Starting auto analysis with:", {
      symbol,
      price,
      selectedTimeframes,
      selectedInterval,
      selectedAnalysisTypes
    });

    if (onAutoAnalysis) {
      onAutoAnalysis();
    }
  };

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
                {SUPPORTED_SYMBOLS.map((s) => (
                  <CommandItem
                    key={s.value}
                    value={s.value}
                    onSelect={() => handleSymbolSelect(s.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        symbol === s.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {s.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          السعر (إجباري)
        </label>
        <div className="flex gap-2">
          <Input
            type="number"
            step="any"
            placeholder="أدخل السعر (إجباري)"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full"
            dir="ltr"
          />
          <Button 
            onClick={handleStartAutoAnalysis}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="icon"
          >
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};