
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SymbolSelectorProps {
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

const SUPPORTED_SYMBOLS = [
  // المعادن الثمينة
  { value: "XAUUSD", label: "الذهب/دولار (XAU/USD)" },
  { value: "XAGUSD", label: "الفضة/دولار (XAG/USD)" },
  // أزواج الفوركس الرئيسية
  { value: "EURUSD", label: "يورو/دولار (EUR/USD)" },
  { value: "GBPUSD", label: "جنيه/دولار (GBP/USD)" },
  { value: "USDJPY", label: "دولار/ين (USD/JPY)" },
  { value: "USDCHF", label: "دولار/فرنك (USD/CHF)" },
  { value: "AUDUSD", label: "دولار استرالي/دولار (AUD/USD)" },
  { value: "NZDUSD", label: "دولار نيوزيلندي/دولار (NZD/USD)" },
  { value: "USDCAD", label: "دولار/دولار كندي (USD/CAD)" },
  // العملات الرقمية
  { value: "BTCUSD", label: "بيتكوين/دولار (BTC/USD)" },
  { value: "ETHUSD", label: "إيثريوم/دولار (ETH/USD)" },
  { value: "BTC", label: "بيتكوين (BTC)" },
  { value: "ETH", label: "إيثريوم (ETH)" }
];

export const SymbolSelector = ({ value, onChange, defaultValue }: SymbolSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        رمز العملة أو الزوج
      </label>
      <Select 
        value={value} 
        onValueChange={onChange}
        defaultValue={defaultValue}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر رمز العملة أو الزوج" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="" disabled className="text-xs text-muted-foreground">-- اختر الرمز --</SelectItem>
          
          <SelectItem value="XAUUSD" className="font-bold">الذهب/دولار (XAU/USD)</SelectItem>
          <SelectItem value="XAGUSD">الفضة/دولار (XAG/USD)</SelectItem>
          
          <SelectItem value="" disabled className="text-xs text-muted-foreground">-- أزواج الفوركس --</SelectItem>
          {SUPPORTED_SYMBOLS.filter(s => !s.value.includes('XA') && !['BTC', 'ETH', 'BTCUSD', 'ETHUSD'].includes(s.value)).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          
          <SelectItem value="" disabled className="text-xs text-muted-foreground">-- العملات الرقمية --</SelectItem>
          {SUPPORTED_SYMBOLS.filter(s => ['BTC', 'ETH', 'BTCUSD', 'ETHUSD'].includes(s.value)).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
