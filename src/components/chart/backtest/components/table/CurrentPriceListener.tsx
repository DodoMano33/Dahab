
import { useState, useEffect } from "react";
import { extractPriceFromChart } from "@/utils/price/capture/priceExtractor";

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => React.ReactNode;
}

export const CurrentPriceListener = ({ children }: CurrentPriceListenerProps) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  // الاستماع لتحديثات السعر من الشارت فقط
  useEffect(() => {
    // استخراج السعر الأولي
    const fetchInitialPrice = async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        console.log("CurrentPriceListener: تم استلام تحديث للسعر:", price);
        setCurrentPrice(price);
      }
    };
    
    // استخراج السعر عند التحميل
    fetchInitialPrice();
    
    // جدولة تحديثات منتظمة
    const updateInterval = setInterval(async () => {
      const price = await extractPriceFromChart();
      if (price !== null && (currentPrice === null || price !== currentPrice)) {
        console.log("CurrentPriceListener: تم تحديث السعر:", price);
        setCurrentPrice(price);
      }
    }, 3000);
    
    return () => {
      clearInterval(updateInterval);
    };
  }, [currentPrice]);

  // إضافة تشخيص للتأكد من توفر السعر
  useEffect(() => {
    console.log("CurrentPriceListener: السعر الحالي =", currentPrice);
  }, [currentPrice]);

  return <>{children(currentPrice)}</>;
};
