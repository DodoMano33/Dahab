
import { useCurrentPrice } from "@/hooks/useCurrentPrice";
import { ReactNode } from "react";

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => ReactNode;
}

export const CurrentPriceListener = ({ children }: CurrentPriceListenerProps) => {
  const { currentPrice } = useCurrentPrice();
  
  return <>{children(currentPrice)}</>;
};
