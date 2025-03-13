
import { useCallback } from 'react';

// القيم المنطقية لسعر الذهب (XAUUSD)
const MIN_VALID_GOLD_PRICE = 500;   // أقل سعر منطقي للذهب (بالدولار)
const MAX_VALID_GOLD_PRICE = 5000;  // أعلى سعر منطقي للذهب (بالدولار)

// التحقق من أن السعر في النطاق المنطقي
const isValidGoldPrice = (price: number): boolean => {
  return !isNaN(price) && price >= MIN_VALID_GOLD_PRICE && price <= MAX_VALID_GOLD_PRICE;
};

/**
 * مدير أحداث TradingView
 */
export const useTradingViewEvents = (
  onPriceUpdate?: (price: number) => void,
  onSymbolChange?: (symbol: string) => void,
  forcedSymbol: string = 'XAUUSD'
) => {
  /**
   * معالج أحداث الرسائل من TradingView
   */
  const handleTradingViewMessage = useCallback((event: MessageEvent, currentPriceRef: React.MutableRefObject<number | null>, lastPriceUpdateTimeRef: React.MutableRefObject<Date | null>, priceUpdateCountRef: React.MutableRefObject<number>, extractionMethodsRef: React.MutableRefObject<string[]>) => {
    try {
      // تحديد الرمز ليكون XAUUSD دائمًا
      if (event.data && event.data.name === 'symbol-change') {
        console.log('Symbol changed, but keeping XAUUSD as the only symbol');
        onSymbolChange?.('XAUUSD');
      }
      
      if (event.data && event.data.name === 'price-update' && 
          event.data.price !== undefined && event.data.price !== null) {
        
        const price = Number(event.data.price);
        if (!isValidGoldPrice(price)) {
          console.warn('Received invalid price from TradingView:', event.data.price);
          return;
        }
        
        priceUpdateCountRef.current += 1;
        lastPriceUpdateTimeRef.current = new Date();
        extractionMethodsRef.current.push('price-update-event');
        
        console.log(`★★★ Price updated from TradingView (${priceUpdateCountRef.current}):`, 
                    price, 'for XAUUSD at', lastPriceUpdateTimeRef.current.toISOString());
        
        // تحديث السعر في المرجع
        currentPriceRef.current = price;
        
        // تخزين معلومات مصدر السعر عالمياً
        window.lastPriceEvent = {
          price,
          timestamp: new Date().toISOString(),
          source: 'TradingView Event',
          method: 'price-update'
        };
        
        // استدعاء معالج التحديث إذا تم توفيره
        onPriceUpdate?.(price);
        
        // نشر حدث تحديث السعر للمكونات الأخرى
        window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
          detail: { 
            price, 
            symbol: 'XAUUSD', 
            timestamp: new Date().toISOString(),
            source: 'TradingView Event'
          }
        }));
      }
      
      // استقبال رد على طلب getCurrentPrice
      if (event.data && event.data.method === 'getCurrentPrice' && 
          event.data.result !== undefined && event.data.result !== null) {
        
        const price = Number(event.data.result);
        if (!isValidGoldPrice(price)) {
          console.warn('Received invalid price from getCurrentPrice response:', event.data.result);
          return;
        }
        
        priceUpdateCountRef.current += 1;
        lastPriceUpdateTimeRef.current = new Date();
        extractionMethodsRef.current.push('getCurrentPrice-response');
        
        console.log(`Price from getCurrentPrice response: ${price}`);
        
        currentPriceRef.current = price;
        
        window.lastPriceEvent = {
          price,
          timestamp: new Date().toISOString(),
          source: 'TradingView API',
          method: 'getCurrentPrice'
        };
        
        onPriceUpdate?.(price);
        
        window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
          detail: { 
            price, 
            symbol: 'XAUUSD', 
            timestamp: new Date().toISOString(),
            source: 'TradingView API'
          }
        }));
      }
    } catch (error) {
      console.error('Error handling TradingView message:', error);
    }
  }, [onPriceUpdate, onSymbolChange, forcedSymbol]);

  /**
   * معالج طلبات السعر الحالي
   */
  const handleCurrentPriceRequest = useCallback((
    currentPriceRef: React.MutableRefObject<number | null>, 
    lastPriceUpdateTimeRef: React.MutableRefObject<Date | null>,
    extractPriceFromChartObject: () => number | null
  ) => {
    if (currentPriceRef.current !== null && isValidGoldPrice(currentPriceRef.current)) {
      console.log('Responding to current-price request with:', currentPriceRef.current);
      window.dispatchEvent(new CustomEvent('current-price-response', {
        detail: { 
          price: currentPriceRef.current,
          timestamp: lastPriceUpdateTimeRef.current?.toISOString() || new Date().toISOString(),
          source: window.lastPriceEvent?.source || 'Cache'
        }
      }));
    } else {
      console.log('Received price request but no price is available yet, trying direct extraction');
      const extractedPrice = extractPriceFromChartObject();
      if (extractedPrice !== null && isValidGoldPrice(extractedPrice)) {
        console.log('Got price via direct extraction for request:', extractedPrice);
        currentPriceRef.current = extractedPrice;
        
        window.lastPriceEvent = {
          price: extractedPrice,
          timestamp: new Date().toISOString(),
          source: 'Direct Extraction on Request',
          method: 'Direct Extraction'
        };
        
        window.dispatchEvent(new CustomEvent('current-price-response', {
          detail: { 
            price: extractedPrice,
            timestamp: new Date().toISOString(),
            source: 'Direct Extraction on Request'
          }
        }));
      } else {
        console.warn('Failed to get price for request via direct extraction');
      }
    }
  }, []);

  return {
    handleTradingViewMessage,
    handleCurrentPriceRequest
  };
};
