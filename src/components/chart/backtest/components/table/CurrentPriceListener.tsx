
import { useState, useEffect } from "react";
import { fetchGoldPrice } from "@/services/alphaVantageService";

interface CurrentPriceListenerProps {
  children: (currentPrice: number | null) => React.ReactNode;
}

export const CurrentPriceListener = ({ children }: CurrentPriceListenerProps) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  // استعلام السعر عند بدء التشغيل
  useEffect(() => {
    const fetchInitialPrice = async () => {
      try {
        const priceData = await fetchGoldPrice();
        setCurrentPrice(priceData.price);
      } catch (error) {
        console.error("فشل في جلب السعر الأولي من Alpha Vantage:", error);
      }
    };

    fetchInitialPrice();
  }, []);

  // الاستماع لتحديثات سعر Alpha Vantage
  useEffect(() => {
    const handleAlphaVantagePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        setCurrentPrice(event.detail.price);
        console.log("تم تحديث السعر من Alpha Vantage:", event.detail.price);
      }
    };

    // الاستماع للتحديثات من TradingView أيضًا كنسخة احتياطية
    const handleTradingViewPriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price && !currentPrice) {
        setCurrentPrice(event.detail.price);
        console.log("تم تحديث السعر من TradingView:", event.detail.price);
      }
    };

    window.addEventListener('alpha-vantage-price-update', handleAlphaVantagePriceUpdate as EventListener);
    window.addEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    
    // طلب تحديث السعر
    window.dispatchEvent(new Event('request-current-price'));
    
    return () => {
      window.removeEventListener('alpha-vantage-price-update', handleAlphaVantagePriceUpdate as EventListener);
      window.removeEventListener('tradingview-price-update', handleTradingViewPriceUpdate as EventListener);
    };
  }, [currentPrice]);

  return <>{children(currentPrice)}</>;
};
