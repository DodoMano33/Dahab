
import React, { useEffect, useRef, useState } from 'react';

interface LiveTradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
}

export const LiveTradingViewChart: React.FC<LiveTradingViewChartProps> = ({ 
  symbol = "XAUUSD",
  onSymbolChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget if any
    containerRef.current.innerHTML = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';

    // Create script for Single Quote Widget
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
    
    // Widget configuration
    script.innerHTML = JSON.stringify({
      symbol: "CFI:XAUUSD",
      width: "100%",
      colorTheme: "light",
      isTransparent: false,
      locale: "ar"
    });

    // Append elements
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    // Function to extract price from widget
    const extractPriceInterval = setInterval(() => {
      try {
        if (containerRef.current) {
          // استخراج السعر من عنصر القيمة الرئيسي ذو الخط الأكبر
          const priceElement = containerRef.current.querySelector('.tv-symbol-price-quote__value');
          if (priceElement) {
            const priceText = priceElement.textContent || '';
            const price = parseFloat(priceText.replace(',', ''));
            if (!isNaN(price)) {
              setCurrentPrice(price);
              console.log('Gold price extracted from main value:', price);
              
              // Emit price change if callback exists
              if (onSymbolChange) {
                onSymbolChange(symbol);
              }
            } else {
              // محاولة بديلة في حالة فشل استخراج السعر من العنصر الرئيسي
              console.log('Could not parse main price value:', priceText);
              fallbackToAlternativePriceElement();
            }
          } else {
            // محاولة بديلة في حالة عدم وجود العنصر الرئيسي
            fallbackToAlternativePriceElement();
          }
        }
      } catch (error) {
        console.error('Error extracting price:', error);
        fallbackToAlternativePriceElement();
      }
    }, 2000); // Check every 2 seconds
    
    // دالة احتياطية للبحث عن عنصر السعر البديل
    function fallbackToAlternativePriceElement() {
      try {
        if (!containerRef.current) return;
        
        const alternativePriceElement = containerRef.current.querySelector('.tv-ticker-item-last__last');
        if (alternativePriceElement) {
          const alternativePriceText = alternativePriceElement.textContent || '';
          const alternativePrice = parseFloat(alternativePriceText.replace(',', ''));
          if (!isNaN(alternativePrice)) {
            setCurrentPrice(alternativePrice);
            console.log('Gold price extracted from alternative element:', alternativePrice);
            
            // Emit price change if callback exists
            if (onSymbolChange) {
              onSymbolChange(symbol);
            }
          } else {
            console.log('Could not parse alternative price:', alternativePriceText);
          }
        } else {
          console.log('Alternative price element not found');
        }
      } catch (error) {
        console.error('Error in fallback price extraction:', error);
      }
    }

    return () => {
      clearInterval(extractPriceInterval);
    };
  }, [symbol, onSymbolChange]);

  return (
    <div className="w-full mb-6">
      <div className="p-1 bg-gray-800 rounded-lg h-64 flex flex-col">
        <div ref={containerRef} className="w-full h-full">
          {/* TradingView Widget will be inserted here */}
        </div>
        {currentPrice && (
          <div className="text-center p-2 bg-white rounded-b-lg">
            <p className="text-lg font-bold text-green-600">
              سعر الذهب الحالي: {currentPrice.toFixed(2)} دولار
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
