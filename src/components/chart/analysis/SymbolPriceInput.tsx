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
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رمز العملة أو الزوج
        </label>
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