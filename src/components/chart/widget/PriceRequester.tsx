
import { useEffect, useRef } from 'react';

interface PriceRequesterProps {
  onPriceUpdate: (price: number) => void;
  forcedSymbol: string;
  enabled?: boolean;
}

export const PriceRequester: React.FC<PriceRequesterProps> = ({ 
  onPriceUpdate, 
  forcedSymbol,
  enabled = true 
}) => {
  const priceRequestIntervals = useRef<NodeJS.Timeout[]>([]);

  // وظيفة طلب السعر من TradingView
  const requestPriceFromTradingView = () => {
    if (!enabled) return;
    
    try {
      window.postMessage({ method: 'getCurrentPrice', symbol: forcedSymbol }, '*');
      console.log('Sent getCurrentPrice request to TradingView via window.postMessage');
      
      if (window.tvWidget && window.tvWidget.chart) {
        try {
          const chartPrice = window.tvWidget.chart().crosshairPrice();
          if (chartPrice && !isNaN(chartPrice)) {
            console.log('Got price directly from chart API:', chartPrice);
            onPriceUpdate(chartPrice);
            window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
              detail: { 
                price: chartPrice, 
                symbol: forcedSymbol,
                source: 'Chart API Direct'
              }
            }));
          }
        } catch (chartError) {
          console.warn('Error accessing chart API:', chartError);
        }
      }
      
      try {
        const priceElements = document.querySelectorAll('.tv-symbol-price-quote__value');
        if (priceElements.length > 0) {
          for (const element of Array.from(priceElements)) {
            const priceText = element.textContent;
            if (priceText) {
              const price = parseFloat(priceText.replace(',', ''));
              if (!isNaN(price) && price > 0) {
                console.log('Got price from DOM:', price);
                onPriceUpdate(price);
                window.dispatchEvent(new CustomEvent('tradingview-price-update', { 
                  detail: { 
                    price, 
                    symbol: forcedSymbol,
                    source: 'DOM Element'
                  }
                }));
                break;
              }
            }
          }
        }
      } catch (domError) {
        console.warn('Error extracting price from DOM:', domError);
      }
    } catch (e) {
      console.warn('Failed to request price from TradingView', e);
    }
  };

  // جدولة طلبات السعر الأولية
  const scheduleInitialPriceRequests = () => {
    if (!enabled) return;
    
    priceRequestIntervals.current.forEach(clearTimeout);
    priceRequestIntervals.current = [];
    
    for (let i = 1; i <= 10; i++) {
      const timeoutId = setTimeout(requestPriceFromTradingView, i * 1000);
      priceRequestIntervals.current.push(timeoutId);
    }
    
    for (let i = 1; i <= 10; i++) {
      const timeoutId = setTimeout(requestPriceFromTradingView, 10000 + i * 3000);
      priceRequestIntervals.current.push(timeoutId);
    }
    
    for (let i = 1; i <= 6; i++) {
      const timeoutId = setTimeout(requestPriceFromTradingView, 40000 + i * 10000);
      priceRequestIntervals.current.push(timeoutId);
    }
    
    const regularPriceInterval = setInterval(requestPriceFromTradingView, 20000);
    priceRequestIntervals.current.push(regularPriceInterval as unknown as NodeJS.Timeout);
  };

  // إعداد طلبات السعر عند تحميل المكون
  useEffect(() => {
    if (!enabled) return;
    
    const initialDelayTimer = setTimeout(() => {
      scheduleInitialPriceRequests();
    }, 3000);
    
    return () => {
      clearTimeout(initialDelayTimer);
      priceRequestIntervals.current.forEach(clearTimeout);
    };
  }, [enabled]);

  return null; // مكون لا يرجع أي UI
};
