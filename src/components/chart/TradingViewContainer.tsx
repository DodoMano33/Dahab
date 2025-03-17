
import React, { useEffect, useRef } from 'react';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';

interface TradingViewContainerProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const TradingViewContainer: React.FC<TradingViewContainerProps> = ({
  symbol = "XAUUSD",
  onSymbolChange,
  onPriceUpdate
}) => {
  // استخدام رمز ثابت مع مزود السعر المحدد
  const forcedSymbol = "XAUUSD"; 
  const priceProvider = "CFI";
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPriceRef = useRef<number | null>(null);
  
  // استخراج السعر من الشارت بشكل دوري
  useEffect(() => {
    // استخراج السعر عند التحميل
    const extractInitialPrice = async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        currentPriceRef.current = price;
        onPriceUpdate?.(price);
      }
    };
    
    // جدولة استخراج متكرر للسعر
    const extractionInterval = setInterval(async () => {
      const price = await extractPriceFromChart();
      if (price !== null && price !== currentPriceRef.current) {
        currentPriceRef.current = price;
        onPriceUpdate?.(price);
      }
    }, 3000);
    
    // البدء باستخراج السعر بعد تحميل الشارت
    const initialExtractionTimeout = setTimeout(extractInitialPrice, 5000);
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      clearInterval(extractionInterval);
      clearTimeout(initialExtractionTimeout);
    };
  }, [onPriceUpdate]);

  return (
    <div 
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
      data-provider={priceProvider}
      className="tradingview-chart-container"
    />
  );
};
