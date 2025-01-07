import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [isManualInput, setIsManualInput] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رمز العملة أو الزوج
        </label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isManualInput ? (
              <Input
                value={symbol}
                onChange={(e) => onSymbolChange(e.target.value)}
                placeholder="أدخل رمز العملة يدوياً"
                className="w-full"
                dir="ltr"
              />
            ) : (
              <Select value={symbol} onValueChange={onSymbolChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر رمز العملة أو الزوج" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_SYMBOLS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} ({option.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <button
              type="button"
              onClick={() => setIsManualInput(!isManualInput)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isManualInput ? "اختيار من القائمة" : "إدخال يدوي"}
            </button>
          </div>
        </div>
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