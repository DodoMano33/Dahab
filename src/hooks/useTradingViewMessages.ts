
import { useEffect, useRef, useState } from 'react';

interface UseTradingViewMessagesProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const useTradingViewMessages = ({
  symbol,
  onSymbolChange,
  onPriceUpdate
}: UseTradingViewMessagesProps) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const currentPriceRef = useRef<number | null>(null);
  const priceUpdateCountRef = useRef<number>(0);
  const lastPriceUpdateTimeRef = useRef<Date | null>(null);
  const extractionMethodsRef = useRef<string[]>([]);

  useEffect(() => {
    // استخدام مجموعة متنوعة من طرق استخراج السعر من TradingView
    const extractPriceFromChartObject = (): number | null => {
      try {
        // Method 1: Direct chart access
        if (window.TradingView && window.TradingView.activeChart) {
          const price = window.TradingView.activeChart.crosshairPrice();
          if (price && !isNaN(price)) {
            extractionMethodsRef.current.push('activeChart.crosshairPrice');
            return price;
          }
        }
        
        // Method 2: Widget API
        const tradingviewIframes = document.querySelectorAll('iframe[src*="tradingview.com"]');
        for (const iframe of Array.from(tradingviewIframes)) {
          try {
            const typedIframe = iframe as HTMLIFrameElement;
            if (typedIframe.contentWindow) {
              typedIframe.contentWindow.postMessage({ method: 'getCurrentPrice' }, '*');
            }
          } catch (iframeError) {
            console.warn('Failed to extract price from iframe:', iframeError);
          }
        }
        
        // Method 3: DOM Extraction - Find price in the DOM
        const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
        for (const element of Array.from(priceElements)) {
          const priceText = element.textContent;
          if (priceText) {
            const price = parseFloat(priceText.replace(',', ''));
            if (!isNaN(price)) {
              extractionMethodsRef.current.push('DOM-Quote');
              return price;
            }
          }
        }
        
        return null;
      } catch (error) {
        console.error('Error extracting price from chart object:', error);
        return null;
      }
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        // تحديد الرمز ليكون XAUUSD دائمًا
        if (event.data && event.data.name === 'symbol-change') {
          console.log('Symbol changed, but keeping XAUUSD as the only symbol');
          onSymbolChange?.('XAUUSD');
        }
        
        if (event.data && event.data.name === 'price-update' && 
            event.data.price !== undefined && event.data.price !== null) {
          
          const price = Number(event.data.price);
          if (isNaN(price) || price <= 0) {
            console.warn('Received invalid price from TradingView:', event.data.price);
            return;
          }
          
          priceUpdateCountRef.current += 1;
          lastPriceUpdateTimeRef.current = new Date();
          extractionMethodsRef.current.push('price-update-event');
          
          console.log(`★★★ Price updated from TradingView (${priceUpdateCountRef.current}):`, 
                      price, 'for XAUUSD at', lastPriceUpdateTimeRef.current.toISOString());
          
          // تحديث السعر في الحالة والمرجع
          setCurrentPrice(price);
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
          if (!isNaN(price) && price > 0) {
            priceUpdateCountRef.current += 1;
            lastPriceUpdateTimeRef.current = new Date();
            extractionMethodsRef.current.push('getCurrentPrice-response');
            
            console.log(`Price from getCurrentPrice response: ${price}`);
            
            setCurrentPrice(price);
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
        }
      } catch (error) {
        console.error('Error handling TradingView message:', error);
      }
    };

    // إضافة مستمع رسائل global
    window.addEventListener('message', handleMessage);
    
    // إضافة استخراج السعر المباشر من الرسم البياني
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
    
    // إضافة مستمع لطلبات السعر الحالي
    const handleCurrentPriceRequest = () => {
      if (currentPriceRef.current !== null) {
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
        if (extractedPrice !== null) {
          console.log('Got price via direct extraction for request:', extractedPrice);
          setCurrentPrice(extractedPrice);
          currentPriceRef.current = extractedPrice;
          
          window.lastPriceEvent = {
            price: extractedPrice,
            timestamp: new Date().toISOString(),
            source: 'Direct Extraction on Request',
            method: extractionMethodsRef.current.join(', ')
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
    };
    
    window.addEventListener('request-current-price', handleCurrentPriceRequest);
    
    // عند التركيب، تأكد من أن TradingView يعرض XAUUSD
    const forcedSymbol = 'XAUUSD';
    if (symbol !== forcedSymbol) {
      console.log(`Forcing symbol to be ${forcedSymbol} instead of ${symbol}`);
      onSymbolChange?.(forcedSymbol);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('request-current-price', handleCurrentPriceRequest);
      clearInterval(directExtractionInterval);
    };
  }, [symbol, onSymbolChange, onPriceUpdate]);

  return {
    currentPrice,
    priceUpdateCount: priceUpdateCountRef.current,
    lastPriceUpdateTime: lastPriceUpdateTimeRef.current,
    extractionMethods: extractionMethodsRef.current
  };
};
