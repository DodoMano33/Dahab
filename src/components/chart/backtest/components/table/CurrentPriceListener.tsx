
import { useCurrentPrice } from "@/hooks/useCurrentPrice";
import { ReactNode, useEffect, useState } from "react";

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => ReactNode;
}

export const CurrentPriceListener = ({ children }: CurrentPriceListenerProps) => {
  const { currentPrice } = useCurrentPrice();
  const [verifiedPrice, setVerifiedPrice] = useState<number | null>(currentPrice);
  
  // التحقق من السعر وضمان تحديثه
  useEffect(() => {
    setVerifiedPrice(currentPrice);
    
    // طلب تحديث إضافي للسعر إذا لم يكن متوفراً
    if (currentPrice === null) {
      window.dispatchEvent(new CustomEvent('request-current-price'));
      
      // محاولة العثور على السعر مباشرة من العناصر المرئية
      const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
      priceElements.forEach(element => {
        const text = element.textContent?.trim();
        if (text) {
          const price = parseFloat(text.replace(/,/g, ''));
          if (!isNaN(price) && price >= 1800 && price <= 3500) {
            console.log(`CurrentPriceListener: العثور على سعر مباشرة = ${price}`);
            setVerifiedPrice(price);
          }
        }
      });
    }
  }, [currentPrice]);
  
  return <>{children(verifiedPrice)}</>;
};
