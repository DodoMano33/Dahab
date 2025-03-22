
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface MarketStatus {
  isOpen: boolean;
  serverTime?: string;
}

export const useMarketStatus = (itemId: string) => {
  const [marketStatus, setMarketStatus] = useState<MarketStatus>({ isOpen: false });
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const lastPriceTimeRef = useRef<number>(Date.now());
  const priceStableTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // استمع إلى تغييرات السعر من API
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        const newPrice = event.detail.price;
        
        // إذا تغير السعر، قم بتحديث الوقت وتعيين حالة السوق إلى مفتوح
        if (lastPrice !== null && newPrice !== lastPrice) {
          console.log(`[MarketStatus] Price changed: ${lastPrice} -> ${newPrice}`);
          lastPriceTimeRef.current = Date.now();
          setMarketStatus(prev => ({ ...prev, isOpen: true }));
          
          // إلغاء المؤقت الحالي إذا كان موجودًا
          if (priceStableTimerRef.current) {
            clearTimeout(priceStableTimerRef.current);
          }
        }
        
        setLastPrice(newPrice);
      }
    };

    // إعداد مؤقت للتحقق من استقرار السعر (مغلق بعد 5 دقائق من عدم الحركة)
    const checkPriceStability = () => {
      const now = Date.now();
      const timeSinceLastChange = now - lastPriceTimeRef.current;
      
      // إذا لم يتغير السعر لأكثر من 5 دقائق، فإن السوق مغلق
      if (timeSinceLastChange > 5 * 60 * 1000) { // 5 دقائق
        console.log(`[MarketStatus] No price change for 5 minutes, market closed`);
        setMarketStatus(prev => ({ ...prev, isOpen: false }));
      } else {
        console.log(`[MarketStatus] Last price change was ${Math.round(timeSinceLastChange/1000)} seconds ago`);
      }
      
      // إعادة جدولة الفحص كل 60 ثانية
      priceStableTimerRef.current = setTimeout(checkPriceStability, 60000); // فحص كل دقيقة
    };
    
    // بدء فحص استقرار السعر
    checkPriceStability();
    
    // التسجيل في أحداث تحديث السعر
    window.addEventListener('metal-price-update', handlePriceUpdate as EventListener);
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    // استخدام API للتحقق الدوري من حالة السوق كنسخة احتياطية
    const checkMarketStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-market-status');
        if (error) {
          console.error(`[${itemId}] Error checking market status:`, error);
          return;
        }
        
        // استخدام حالة السوق من API فقط إذا لم نتلق تحديثات سعر حديثة
        const now = Date.now();
        const timeSinceLastChange = now - lastPriceTimeRef.current;
        
        // إذا لم نتلق تحديثات سعر خلال الـ 10 دقائق الماضية، استخدم API
        if (timeSinceLastChange > 10 * 60 * 1000) {
          console.log(`[MarketStatus] Using API status check as backup`);
          setMarketStatus(data);
        }
      } catch (err) {
        console.error(`[${itemId}] Failed to check market status:`, err);
      }
    };
    
    // تحقق من API كل 15 دقيقة كنسخة احتياطية
    const backupInterval = setInterval(checkMarketStatus, 15 * 60 * 1000);
    
    // تنظيف
    return () => {
      window.removeEventListener('metal-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      clearInterval(backupInterval);
      if (priceStableTimerRef.current) {
        clearTimeout(priceStableTimerRef.current);
      }
    };
  }, [itemId, lastPrice]);
  
  return marketStatus;
};
