
import React, { useEffect } from 'react';
import { useTradingViewChart } from '@/hooks/useTradingViewChart';
import { useTradingViewMessages } from '@/hooks/useTradingViewMessages';
import { useAnalysisChecker } from '@/hooks/useAnalysisChecker';

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
  
  // استخدام هوك الشارت
  const { containerRef, currentPriceRef } = useTradingViewChart({ 
    symbol: forcedSymbol,
    onPriceUpdate
  });

  // استخدام هوك الرسائل لتلقي تحديثات السعر
  const { currentPrice } = useTradingViewMessages({
    symbol: forcedSymbol,
    onSymbolChange,
    onPriceUpdate: (price) => {
      currentPriceRef.current = price;
      onPriceUpdate?.(price);
      
      // إرسال تحديث السعر إلى جميع مكونات التطبيق مع تحديد المزود
      window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
        detail: { 
          price, 
          symbol: `${priceProvider}:${forcedSymbol}`,
          timestamp: Date.now(),
          provider: priceProvider
        }
      }));
      
      // إضافة حدث مخصص لتحديثات سعر الشارت مباشرة
      window.dispatchEvent(new CustomEvent('chart-price-update', { 
        detail: { 
          price, 
          symbol: `${priceProvider}:${forcedSymbol}`,
          timestamp: Date.now(),
          provider: priceProvider,
          source: 'tradingview'
        }
      }));
    }
  });

  // تفعيل فحص التحليلات
  useAnalysisChecker({
    symbol: forcedSymbol,
    currentPriceRef
  });

  return (
    <div 
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
      data-provider={priceProvider}
      className="tradingview-chart-container"
    />
  );
};
