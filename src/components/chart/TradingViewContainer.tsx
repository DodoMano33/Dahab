
import React, { useEffect, useRef } from 'react';
import { createTradingViewWidget } from '@/utils/tradingview/chartSetup';
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
  
  // تهيئة الشارت عند تحميل المكون
  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log('إنشاء شارت TradingView للرمز:', forcedSymbol, 'مع المزود:', priceProvider);
    
    // إنشاء شارت TradingView داخل الحاوية
    const { widgetDiv } = createTradingViewWidget(containerRef.current, forcedSymbol, priceProvider);
    
    // تأخير قصير لضمان تحميل الشارت ثم محاولة استخراج السعر
    const initialTimeout = setTimeout(() => {
      console.log('محاولة استخراج السعر المبدئي بعد تحميل الشارت...');
      extractInitialPrice();
    }, 3000);
    
    // استخراج السعر الأولي
    const extractInitialPrice = async () => {
      const price = await extractPriceFromChart();
      if (price !== null) {
        console.log('تم استخراج السعر المبدئي:', price);
        currentPriceRef.current = price;
        onPriceUpdate?.(price);
      } else {
        console.log('فشل في استخراج السعر المبدئي، سيتم المحاولة مرة أخرى...');
      }
    };
    
    // جدولة استخراج متكرر للسعر
    const extractionInterval = setInterval(async () => {
      const price = await extractPriceFromChart();
      if (price !== null && price !== currentPriceRef.current) {
        console.log('تم استخراج سعر جديد:', price);
        currentPriceRef.current = price;
        onPriceUpdate?.(price);
      }
    }, 3000);
    
    // التنظيف عند إلغاء تحميل المكون
    return () => {
      clearInterval(extractionInterval);
      clearTimeout(initialTimeout);
      
      // تنظيف الحاوية
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [forcedSymbol, priceProvider, onPriceUpdate]);

  return (
    <div 
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
      data-provider={priceProvider}
      className="tradingview-chart-container"
    />
  );
};
