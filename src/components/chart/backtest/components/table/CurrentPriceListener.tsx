
import React, { useState, useEffect } from 'react';

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => React.ReactNode;
}

export const CurrentPriceListener: React.FC<CurrentPriceListenerProps> = ({ children }) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    // مستمع لسعر TradingView
    const handleTradingViewPriceUpdate = (event: CustomEvent<{ price: number }>) => {
      if (event.detail && event.detail.price) {
        setCurrentPrice(event.detail.price);
        console.log("CurrentPriceListener: تم تحديث السعر من حدث TradingView:", event.detail.price);
      }
    };

    // مستمع لطلب تحديث السعر
    const handleRequestPrice = () => {
      console.log("CurrentPriceListener: تم استلام طلب تحديث السعر");
      // إرسال الحدث ui-price-update لتحديث السعر في واجهة المستخدم
      if (currentPrice) {
        window.dispatchEvent(
          new CustomEvent('ui-price-update', {
            detail: { price: currentPrice }
          })
        );
      }
    };

    // إضافة المستمعين
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    window.addEventListener('request-ui-price-update', handleRequestPrice);

    // إزالة المستمعين عند إلغاء التركيب
    return () => {
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
      window.removeEventListener('request-ui-price-update', handleRequestPrice);
    };
  }, [currentPrice]);

  return <>{children(currentPrice)}</>;
};
