
import React, { useState, useEffect } from 'react';
import { TradingViewStats } from './TradingViewStats';
import { getLastExtractedPrice } from '@/utils/price/screenshotPriceExtractor';

interface CurrentPriceDisplayProps {
  price: number | null;
}

export const CurrentPriceDisplay: React.FC<CurrentPriceDisplayProps> = ({ price: propPrice }) => {
  const [displayPrice, setDisplayPrice] = useState<number | null>(null);
  const [priceSource, setPriceSource] = useState<'extracted' | 'provided'>('provided');
  
  // استخدام هوك واحد يستمع لجميع مصادر تحديث السعر
  useEffect(() => {
    // استخدام آخر سعر مستخرج عند التحميل
    const lastExtractedPrice = getLastExtractedPrice();
    if (lastExtractedPrice !== null) {
      setDisplayPrice(lastExtractedPrice);
      setPriceSource('extracted');
    } else if (propPrice !== null) {
      setDisplayPrice(propPrice);
      setPriceSource('provided');
    }
    
    // الاستماع لتحديثات السعر المستخرج من الصورة
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        setDisplayPrice(event.detail.price);
        setPriceSource('extracted');
      }
    };

    // الاستماع لتحديثات السعر
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    };
  }, [propPrice]);

  // تحديث السعر المعروض عند تغير propPrice إذا لم يكن هناك سعر مستخرج
  useEffect(() => {
    if (priceSource !== 'extracted' && propPrice !== null) {
      setDisplayPrice(propPrice);
    }
  }, [propPrice, priceSource]);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/95 text-white py-4 px-3">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xs">
            <span className="text-yellow-500 mr-1">CFI:</span>
            XAUUSD (الذهب)
          </div>
          <div className="text-sm" id="tradingview-price-display">
            {displayPrice ? 
              `السعر الحالي: ${displayPrice.toFixed(2)}${priceSource === 'extracted' ? ' (من الشارت)' : ''}` : 
              'بانتظار السعر... (قد يستغرق التحميل بضع ثوانٍ)'
            }
          </div>
        </div>
        
        <TradingViewStats symbol="CFI:XAUUSD" />
      </div>
    </div>
  );
};
