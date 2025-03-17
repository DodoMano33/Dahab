
import { useCurrentPrice } from "@/hooks/useCurrentPrice";
import { ReactNode, useEffect } from "react";

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => ReactNode;
}

export const CurrentPriceListener = ({ children }: CurrentPriceListenerProps) => {
  const { currentPrice } = useCurrentPrice();
  
  // فقط استمع إلى أحداث price-updated من TradingViewWidget
  // ولا تحاول الحصول على السعر من أي مكان آخر
  
  return <>{children(currentPrice)}</>;
};
