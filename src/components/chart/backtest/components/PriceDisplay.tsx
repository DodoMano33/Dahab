
import { Badge } from "@/components/ui/badge";

interface PriceDisplayProps {
  currentPrice: number | null;
  priceUpdateCount: number;
}

export const PriceDisplay = ({ currentPrice, priceUpdateCount }: PriceDisplayProps) => {
  if (!currentPrice) {
    return (
      <div className="mt-2 p-2 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">لم يتم العثور على سعر حالي</p>
      </div>
    );
  }

  return (
    <div className="mt-2 p-2 bg-muted/20 rounded-md">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">السعر الحالي:</span>
        <Badge variant="outline" className="font-mono">
          {currentPrice.toFixed(2)}
        </Badge>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {priceUpdateCount > 0 ? `تم تحديث السعر ${priceUpdateCount} مرة` : "لم يتم تحديث السعر بعد"}
      </div>
    </div>
  );
};
