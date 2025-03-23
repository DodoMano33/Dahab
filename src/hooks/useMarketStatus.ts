
import { useState, useEffect } from 'react';

interface MarketStatusResult {
  isOpen: boolean;
  isWeekend: boolean;
  nextOpeningTime: Date | null;
}

/**
 * التحقق مما إذا كانت السوق مغلقة (السبت أو الأحد)
 */
export const isMarketClosed = (): boolean => {
  const day = new Date().getDay();
  // 0 = الأحد، 6 = السبت
  return day === 0 || day === 6;
};

/**
 * حساب وقت الافتتاح التالي للسوق
 */
export const getNextOpeningTime = (): Date | null => {
  const now = new Date();
  const day = now.getDay();
  
  if (day === 5) { // الجمعة
    // السوق ستفتح يوم الاثنين القادم الساعة 00:00 بتوقيت جرينتش
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + 3); // +3 أيام للانتقال إلى الاثنين
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  } else if (day === 6) { // السبت
    // السوق ستفتح يوم الاثنين القادم الساعة 00:00 بتوقيت جرينتش
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + 2); // +2 أيام للانتقال إلى الاثنين
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  } else if (day === 0) { // الأحد
    // السوق ستفتح يوم الاثنين القادم الساعة 00:00 بتوقيت جرينتش
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + 1); // +1 يوم للانتقال إلى الاثنين
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  }
  
  return null; // السوق مفتوحة حالياً
};

/**
 * Hook للتحقق من حالة السوق (مفتوح أم مغلق)
 */
export const useMarketStatus = (): MarketStatusResult => {
  const [marketStatus, setMarketStatus] = useState<MarketStatusResult>({
    isOpen: !isMarketClosed(),
    isWeekend: isMarketClosed(),
    nextOpeningTime: getNextOpeningTime()
  });
  
  useEffect(() => {
    // تحديث حالة السوق كل دقيقة
    const updateMarketStatus = () => {
      const weekend = isMarketClosed();
      setMarketStatus({
        isOpen: !weekend,
        isWeekend: weekend,
        nextOpeningTime: getNextOpeningTime()
      });
    };
    
    // التحديث الأولي
    updateMarketStatus();
    
    // إعداد مؤقت للتحديث كل دقيقة
    const interval = setInterval(updateMarketStatus, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return marketStatus;
};
