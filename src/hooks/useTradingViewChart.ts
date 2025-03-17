
/**
 * Hook for managing TradingView chart setup and lifecycle
 */
import { useEffect, useRef } from 'react';
import { createTradingViewWidget } from '@/utils/tradingview/chartSetup';
import { extractPriceFromChart } from '@/utils/price/capture/priceExtractor';
import { setCapturingState } from '@/utils/price/capture/state';

interface UseTradingViewChartProps {
  symbol?: string;
  onPriceUpdate?: (price: number) => void;
}

export const useTradingViewChart = ({ 
  symbol = "XAUUSD",
  onPriceUpdate 
}: UseTradingViewChartProps = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPriceRef = useRef<number | null>(null);
  const priceProvider = "CFI";

  useEffect(() => {
    if (!containerRef.current) return;
    
    console.log('TradingViewWidget mounted with symbol:', symbol, 'provider:', priceProvider);
    
    // Create and setup the TradingView widget
    const { widgetDiv } = createTradingViewWidget(containerRef.current);
    
    // تفعيل وضع التقاط السعر
    setCapturingState(true);
    
    // جدولة استخراج السعر بشكل دوري
    const startPriceExtraction = () => {
      // استخراج السعر المبدئي
      const extractInitialPrice = async () => {
        const price = await extractPriceFromChart();
        if (price !== null) {
          currentPriceRef.current = price;
          onPriceUpdate?.(price);
        }
      };
      
      // محاولة استخراج السعر مبدئيًا
      setTimeout(extractInitialPrice, 5000);
      setTimeout(extractInitialPrice, 10000);
      
      // جدولة تحديثات منتظمة
      const extractionInterval = setInterval(async () => {
        const price = await extractPriceFromChart();
        if (price !== null) {
          currentPriceRef.current = price;
          onPriceUpdate?.(price);
        }
      }, 3000);
      
      return extractionInterval;
    };
    
    // بدء استخراج السعر
    const extractionInterval = startPriceExtraction();

    return () => {
      // إيقاف التقاط السعر
      setCapturingState(false);
      
      // إيقاف التحديثات الدورية
      clearInterval(extractionInterval);
      
      // تنظيف المحتوى
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, onPriceUpdate]);

  return {
    containerRef,
    currentPriceRef
  };
};
