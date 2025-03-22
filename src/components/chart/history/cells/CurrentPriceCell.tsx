
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useCurrentPrice } from "@/hooks/current-price";
import { useEffect, useState } from "react";

interface CurrentPriceCellProps {
  price: number;
}

export const CurrentPriceCell = ({ price: initialPrice }: CurrentPriceCellProps) => {
  const { currentPrice: realTimePrice } = useCurrentPrice();
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);
  
  useEffect(() => {
    // نستخدم السعر الحقيقي من Metal Price API إذا كان متاحاً
    if (realTimePrice !== null) {
      setDisplayPrice(realTimePrice);
    } else if (initialPrice) {
      // نستخدم السعر الأولي كاحتياطي إذا لم يكن هناك سعر حقيقي
      setDisplayPrice(initialPrice);
    }
  }, [realTimePrice, initialPrice]);
  
  const formatNumber = (value: number | null) => {
    if (value === null) return "-";
    return value.toFixed(4);
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={realTimePrice ? 'font-medium text-primary' : ''}>
              {formatNumber(displayPrice)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>السعر الحقيقي المباشر</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
