
import { useRef } from 'react';

/**
 * استخراج السعر من مخطط TradingView بعدة طرق
 */
export const usePriceExtractors = () => {
  const extractionMethodsRef = useRef<string[]>([]);

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

  return {
    extractPriceFromChartObject,
    extractionMethods: extractionMethodsRef.current
  };
};
