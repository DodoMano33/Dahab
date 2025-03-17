
import { ReactNode, useEffect, useState } from "react";

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => ReactNode;
}

export const CurrentPriceListener = ({ children }: CurrentPriceListenerProps) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  // الاستماع إلى أحداث price-updated فقط
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail?.price) {
        setCurrentPrice(event.detail.price);
      }
    };
    
    window.addEventListener('price-updated', handlePriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('price-updated', handlePriceUpdate as EventListener);
    };
  }, []);
  
  return <>{children(currentPrice)}</>;
};
