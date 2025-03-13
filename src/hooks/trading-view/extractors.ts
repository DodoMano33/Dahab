
import { useRef } from 'react';

// القيم المنطقية لسعر الذهب (XAUUSD)
const MIN_VALID_GOLD_PRICE = 500;   // أقل سعر منطقي للذهب (بالدولار)
const MAX_VALID_GOLD_PRICE = 5000;  // أعلى سعر منطقي للذهب (بالدولار)

/**
 * استخراج السعر من مخطط TradingView بعدة طرق
 */
export const usePriceExtractors = () => {
  const extractionMethodsRef = useRef<string[]>([]);

  // التحقق من أن السعر في النطاق المنطقي
  const isValidGoldPrice = (price: number): boolean => {
    return !isNaN(price) && price >= MIN_VALID_GOLD_PRICE && price <= MAX_VALID_GOLD_PRICE;
  };

  const extractPriceFromChartObject = (): number | null => {
    try {
      // Method 1: Direct chart access
      if (window.TradingView && window.TradingView.activeChart) {
        const price = window.TradingView.activeChart.crosshairPrice();
        if (price && isValidGoldPrice(price)) {
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
          if (isValidGoldPrice(price)) {
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

  return {
    extractPriceFromChartObject,
    extractionMethods: extractionMethodsRef.current
  };
};
