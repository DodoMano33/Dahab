
import { useEffect, useState, useRef } from 'react';
import { useCurrentPrice } from '@/hooks/current-price';
import { useSearchHistory } from '../../hooks/search-history';
import { toast } from 'sonner';

export interface PriceLevelData {
  price: number | null;
  label: string;
  id?: string;
}

export const usePriceLevels = () => {
  const { currentPrice } = useCurrentPrice();
  const { searchHistory } = useSearchHistory();
  const prevPriceRef = useRef<number | null>(null);

  const [bullishTarget, setBullishTarget] = useState<PriceLevelData>({ price: null, label: 'هدف صعودي' });
  const [bullishStopLoss, setBullishStopLoss] = useState<PriceLevelData>({ price: null, label: 'وقف خسارة صعودي' });
  const [bearishTarget, setBearishTarget] = useState<PriceLevelData>({ price: null, label: 'هدف هبوطي' });
  const [bearishStopLoss, setBearishStopLoss] = useState<PriceLevelData>({ price: null, label: 'وقف خسارة هبوطي' });
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);

  // مراقبة تغيرات السعر وتحديث اتجاه السعر
  useEffect(() => {
    if (currentPrice !== null && prevPriceRef.current !== null) {
      if (currentPrice > prevPriceRef.current) {
        setPriceDirection('up');
      } else if (currentPrice < prevPriceRef.current) {
        setPriceDirection('down');
      }
    }
    
    // تحديث السعر السابق
    prevPriceRef.current = currentPrice;
  }, [currentPrice]);
  
  // إعادة تعيين اتجاه السعر بعد فترة قصيرة
  useEffect(() => {
    if (priceDirection) {
      const timer = setTimeout(() => {
        setPriceDirection(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [priceDirection]);
  
  // تحديث المستويات بناءً على سجل البحث
  useEffect(() => {
    if (!searchHistory || !searchHistory.length) return;
    
    console.log("جميع التحليلات المتاحة:", searchHistory.length);
    
    // الحصول على التحليلات الصعودية والهبوطية غير المنتهية
    const bullishAnalyses = searchHistory.filter(item => 
      (item.analysis?.direction === 'صاعد') && 
      !item.stopLossHit && !item.targetHit && !item.result_timestamp
    );
    
    const bearishAnalyses = searchHistory.filter(item => 
      (item.analysis?.direction === 'هابط') && 
      !item.stopLossHit && !item.targetHit && !item.result_timestamp
    );
    
    console.log("التحليلات الصعودية:", bullishAnalyses.length);
    console.log("التحليلات الهبوطية:", bearishAnalyses.length);
    
    // البحث عن أقرب هدف صعودي
    if (bullishAnalyses.length > 0) {
      // ترتيب التحليلات حسب الهدف الأول (الأقرب للسعر الحالي)
      const sortedBullishByTarget = [...bullishAnalyses].sort((a, b) => {
        const aTarget = a.analysis?.targets?.[0]?.price || Number.MAX_VALUE;
        const bTarget = b.analysis?.targets?.[0]?.price || Number.MAX_VALUE;
        
        // نريد الهدف الأقرب للسعر الحالي (الأصغر فارقًا)
        if (currentPrice) {
          return Math.abs(aTarget - currentPrice) - Math.abs(bTarget - currentPrice);
        }
        return aTarget - bTarget;
      });
      
      const closestBullish = sortedBullishByTarget[0];
      const closestBullishTarget = closestBullish?.analysis?.targets?.[0]?.price || null;
      
      console.log("أقرب هدف صعودي:", closestBullishTarget);
      
      if (closestBullishTarget) {
        setBullishTarget({ 
          price: closestBullishTarget, 
          label: 'هدف صعودي',
          id: closestBullish.id
        });
      }
      
      // البحث عن أقرب وقف خسارة صعودي
      const sortedBullishByStopLoss = [...bullishAnalyses].sort((a, b) => {
        const aStopLoss = a.analysis?.stopLoss || 0;
        const bStopLoss = b.analysis?.stopLoss || 0;
        
        // نريد وقف الخسارة الأقرب للسعر الحالي (الأكبر قيمة لوقف الخسارة)
        return bStopLoss - aStopLoss;
      });
      
      const closestBullishStopLossAnalysis = sortedBullishByStopLoss[0];
      const closestBullishStopLoss = closestBullishStopLossAnalysis?.analysis?.stopLoss || null;
      
      console.log("أقرب وقف خسارة صعودي:", closestBullishStopLoss);
      
      if (closestBullishStopLoss) {
        setBullishStopLoss({ 
          price: closestBullishStopLoss, 
          label: 'وقف خسارة صعودي',
          id: closestBullishStopLossAnalysis.id
        });
      }
    }
    
    // البحث عن أقرب هدف هبوطي
    if (bearishAnalyses.length > 0) {
      // ترتيب التحليلات حسب الهدف الأول (الأقرب للسعر الحالي)
      const sortedBearishByTarget = [...bearishAnalyses].sort((a, b) => {
        const aTarget = a.analysis?.targets?.[0]?.price || Number.MAX_VALUE;
        const bTarget = b.analysis?.targets?.[0]?.price || Number.MAX_VALUE;
        
        // نريد الهدف الأقرب للسعر الحالي (الأصغر فارقًا)
        if (currentPrice) {
          return Math.abs(aTarget - currentPrice) - Math.abs(bTarget - currentPrice);
        }
        return aTarget - bTarget; // للهبوطي نريد أيضًا القيمة الأقرب للسعر الحالي
      });
      
      const closestBearish = sortedBearishByTarget[0];
      const closestBearishTarget = closestBearish?.analysis?.targets?.[0]?.price || null;
      
      console.log("أقرب هدف هبوطي:", closestBearishTarget);
      
      if (closestBearishTarget) {
        setBearishTarget({ 
          price: closestBearishTarget, 
          label: 'هدف هبوطي',
          id: closestBearish.id 
        });
      }
      
      // البحث عن أقرب وقف خسارة هبوطي
      const sortedBearishByStopLoss = [...bearishAnalyses].sort((a, b) => {
        const aStopLoss = a.analysis?.stopLoss || 0;
        const bStopLoss = b.analysis?.stopLoss || 0;
        
        // للهبوطي نريد وقف الخسارة الأكبر من السعر الحالي
        return aStopLoss - bStopLoss; // ترتيب تصاعدي
      });
      
      const closestBearishStopLossAnalysis = sortedBearishByStopLoss[0];
      const closestBearishStopLoss = closestBearishStopLossAnalysis?.analysis?.stopLoss || null;
      
      console.log("أقرب وقف خسارة هبوطي:", closestBearishStopLoss);
      
      if (closestBearishStopLoss) {
        setBearishStopLoss({ 
          price: closestBearishStopLoss, 
          label: 'وقف خسارة هبوطي',
          id: closestBearishStopLossAnalysis.id 
        });
      }
    }
  }, [searchHistory, currentPrice]);
  
  // التحقق من تجاوز السعر للأهداف ووقف الخسارة
  useEffect(() => {
    if (!currentPrice) return;
    
    // تحقق الأهداف الصعودية
    if (bullishTarget.price !== null && bullishTarget.id && currentPrice >= bullishTarget.price) {
      console.log("تم تحقيق الهدف الصعودي:", bullishTarget.price);
      
      // عرض إشعار توست
      toast.success(
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="font-bold">تم تحقيق الهدف الصعودي</div>
          <div>السعر: {bullishTarget.price}</div>
        </div>, 
        {
          position: "top-center",
          duration: 4000,
        }
      );
      
      // تحديث التحليل في قاعدة البيانات (يمكن إضافة هذه الميزة لاحقًا)
      setBullishTarget({ price: null, label: 'هدف صعودي' });
    }
    
    // تحقق وقف الخسارة الصعودي
    if (bullishStopLoss.price !== null && bullishStopLoss.id && currentPrice <= bullishStopLoss.price) {
      console.log("تم تفعيل وقف الخسارة الصعودي:", bullishStopLoss.price);
      
      // عرض إشعار توست
      toast.error(
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="font-bold">تم تفعيل وقف الخسارة الصعودي</div>
          <div>السعر: {bullishStopLoss.price}</div>
        </div>, 
        {
          position: "top-center",
          duration: 4000,
        }
      );
      
      // تحديث التحليل في قاعدة البيانات (يمكن إضافة هذه الميزة لاحقًا)
      setBullishStopLoss({ price: null, label: 'وقف خسارة صعودي' });
    }
    
    // تحقق الأهداف الهبوطية
    if (bearishTarget.price !== null && bearishTarget.id && currentPrice <= bearishTarget.price) {
      console.log("تم تحقيق الهدف الهبوطي:", bearishTarget.price);
      
      // عرض إشعار توست
      toast.success(
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="font-bold">تم تحقيق الهدف الهبوطي</div>
          <div>السعر: {bearishTarget.price}</div>
        </div>, 
        {
          position: "top-center",
          duration: 4000,
        }
      );
      
      // تحديث التحليل في قاعدة البيانات (يمكن إضافة هذه الميزة لاحقًا)
      setBearishTarget({ price: null, label: 'هدف هبوطي' });
    }
    
    // تحقق وقف الخسارة الهبوطي
    if (bearishStopLoss.price !== null && bearishStopLoss.id && currentPrice >= bearishStopLoss.price) {
      console.log("تم تفعيل وقف الخسارة الهبوطي:", bearishStopLoss.price);
      
      // عرض إشعار توست
      toast.error(
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="font-bold">تم تفعيل وقف الخسارة الهبوطي</div>
          <div>السعر: {bearishStopLoss.price}</div>
        </div>, 
        {
          position: "top-center",
          duration: 4000,
        }
      );
      
      // تحديث التحليل في قاعدة البيانات (يمكن إضافة هذه الميزة لاحقًا)
      setBearishStopLoss({ price: null, label: 'وقف خسارة هبوطي' });
    }
    
  }, [currentPrice, bullishTarget, bullishStopLoss, bearishTarget, bearishStopLoss]);
  
  // تنسيق الرقم لعرض 2 أرقام عشرية
  const formatPrice = (price: number | null) => {
    if (price === null) return "-";
    return price.toFixed(2);
  };
  
  // دالة لتحديد لون خلفية السعر الحالي بناء على اتجاه السعر
  const getPriceBackgroundColor = () => {
    if (priceDirection === 'up') {
      return 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 border-green-300 dark:border-green-700';
    } else if (priceDirection === 'down') {
      return 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 border-red-300 dark:border-red-700';
    }
    return 'bg-slate-200 dark:bg-slate-700';
  };

  return {
    currentPrice,
    bullishTarget,
    bullishStopLoss,
    bearishTarget,
    bearishStopLoss,
    priceDirection,
    formatPrice,
    getPriceBackgroundColor
  };
};
