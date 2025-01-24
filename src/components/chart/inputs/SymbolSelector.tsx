import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SymbolSelectorProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
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

export const SymbolSelector = ({ value, onChange, defaultValue }: SymbolSelectorProps) => {
  const [useCustomSymbol, setUseCustomSymbol] = useState(false);

  const handleSymbolChange = (newValue: string) => {
    if (newValue === "custom") {
      setUseCustomSymbol(true);
      onChange("");
    } else {
      onChange(newValue);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        رمز العملة أو الزوج
      </label>
      {useCustomSymbol ? (
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            placeholder="أدخل الرمز يدوياً"
            className="flex-1"
            dir="ltr"
          />
          <button
            onClick={() => setUseCustomSymbol(false)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            العودة للقائمة
          </button>
        </div>
      ) : (
        <Select 
          value={value || defaultValue} 
          onValueChange={handleSymbolChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر رمز العملة أو الزوج" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_SYMBOLS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label} ({option.value})
              </SelectItem>
            ))}
            <SelectItem value="custom">إدخال رمز مخصص...</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};