
import React from 'react';
import { TradingViewStats } from './TradingViewStats';
import { useExtractedPrice } from '@/hooks/useExtractedPrice';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price: propPrice }) => {
  // استخدام الهوك الجديد للحصول على السعر المستخرج
  const { 
    price: displayPrice, 
    priceSource, 
    hasPrice, 
    isAlphaVantagePrice 
  } = useExtractedPrice({
    defaultPrice: propPrice
  });

  // تحديد نص مصدر السعر
  const getPriceSourceText = () => {
    if (isAlphaVantagePrice) {
      return ' (Alpha Vantage API)';
    } else if (priceSource === 'extracted') {
      return ' (من الشارت)';
    } else if (priceSource === 'tradingview') {
      return ' (TradingView)';
    }
    return '';
  };

  return (
    <div className="bg-black/95 text-white py-4 px-3 rounded-lg shadow-lg">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xs">
            <span className="text-yellow-500 mr-1">CFI:</span>
            XAUUSD (الذهب)
          </div>
          <div className="text-sm" id="tradingview-price-display">
            {hasPrice ? 
              `السعر الحالي: ${displayPrice!.toFixed(2)}${getPriceSourceText()}` : 
              'بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)'
            }
          </div>
        </div>
        
        <TradingViewStats symbol="CFI:XAUUSD" />
      </div>
    </div>
  );
};
