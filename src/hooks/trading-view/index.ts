
import { useEffect, useRef, useState } from 'react';
import { UseTradingViewMessagesProps, UseTradingViewMessagesResult } from './types';
import { usePriceExtractors } from './extractors';
import { useTradingViewEvents } from './events';

/**
 * هوك لإدارة الاتصال والرسائل مع TradingView
 */
export const useTradingViewMessages = ({
  symbol,
  onSymbolChange,
  onPriceUpdate
}: UseTradingViewMessagesProps): UseTradingViewMessagesResult => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const currentPriceRef = useRef<number | null>(null);
  const priceUpdateCountRef = useRef<number>(0);
  const lastPriceUpdateTimeRef = useRef<Date | null>(null);
  const extractionMethodsRef = useRef<string[]>([]);

  // استيراد وظائف استخراج السعر
  const { extractPriceFromChartObject } = usePriceExtractors();

  // استيراد مديري الأحداث
  const forcedSymbol = 'XAUUSD';
  const { 
    handleTradingViewMessage, 
    handleCurrentPriceRequest 
  } = useTradingViewEvents(onPriceUpdate, onSymbolChange, forcedSymbol);

  useEffect(() => {
    // إنشاء وظيفة منتطمة لإستخراج السعر مباشرة
    const directExtractionInterval = setInterval(() => {
      const extractedPrice = extractPriceFromChartObject();
      if (extractedPrice !== null && 
          (currentPriceRef.current === null || Math.abs(extractedPrice - currentPriceRef.current) > 0.001)) {
        priceUpdateCountRef.current += 1;
        lastPriceUpdateTimeRef.current = new Date();
        
        console.log(`★★★ Price updated from direct extraction (${priceUpdateCountRef.current}):`, 
                    extractedPrice, 'at', lastPriceUpdateTimeRef.current?.toISOString());
        
        setCurrentPrice(extractedPrice);
        currentPriceRef.current = extractedPrice;
        
        window.lastPriceEvent = {
          price: extractedPrice,
          timestamp: new Date().toISOString(),
          source: 'Direct Extraction',
          method: extractionMethodsRef.current.join(', ')
        };
        
        onPriceUpdate?.(extractedPrice);
        
        window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
          detail: { 
            price: extractedPrice, 
            symbol: 'XAUUSD', 
            timestamp: new Date().toISOString(),
            source: 'Direct Extraction'
          }
        }));
      }
    }, 1000);

    // إعداد معالج الرسائل من TradingView
    const messageHandler = (event: MessageEvent) => 
      handleTradingViewMessage(event, currentPriceRef, lastPriceUpdateTimeRef, priceUpdateCountRef, extractionMethodsRef);

    // إعداد معالج طلبات السعر الحالي
    const currentPriceRequestHandler = () => 
      handleCurrentPriceRequest(currentPriceRef, lastPriceUpdateTimeRef, extractPriceFromChartObject);
    
    // إضافة مستمعي الأحداث
    window.addEventListener('message', messageHandler);
    window.addEventListener('request-current-price', currentPriceRequestHandler);
    
    // عند التركيب، تأكد من أن TradingView يعرض XAUUSD
    if (symbol !== forcedSymbol) {
      console.log(`Forcing symbol to be ${forcedSymbol} instead of ${symbol}`);
      onSymbolChange?.(forcedSymbol);
    }

    return () => {
      // تنظيف مستمعي الأحداث والمؤقتات
      window.removeEventListener('message', messageHandler);
      window.removeEventListener('request-current-price', currentPriceRequestHandler);
      clearInterval(directExtractionInterval);
    };
  }, [
    symbol, 
    onSymbolChange, 
    onPriceUpdate, 
    handleTradingViewMessage, 
    handleCurrentPriceRequest, 
    extractPriceFromChartObject, 
    forcedSymbol
  ]);

  return {
    currentPrice,
    priceUpdateCount: priceUpdateCountRef.current,
    lastPriceUpdateTime: lastPriceUpdateTimeRef.current,
    extractionMethods: extractionMethodsRef.current
  };
};
