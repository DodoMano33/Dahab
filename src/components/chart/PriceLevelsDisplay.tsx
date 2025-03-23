
import { useEffect, useState } from 'react';
import { useCurrentPrice } from '@/hooks/current-price';
import { Card } from '@/components/ui/card';
import { useSearchHistory } from '../hooks/search-history';

interface PriceLevelData {
  price: number | null;
  label: string;
}

export const PriceLevelsDisplay = () => {
  const { currentPrice } = useCurrentPrice();
  const { searchHistory } = useSearchHistory();
  
  const [bullishTarget, setBullishTarget] = useState<PriceLevelData>({ price: null, label: 'هدف صعودي' });
  const [bullishStopLoss, setBullishStopLoss] = useState<PriceLevelData>({ price: null, label: 'وقف خسارة صعودي' });
  const [bearishTarget, setBearishTarget] = useState<PriceLevelData>({ price: null, label: 'هدف هبوطي' });
  const [bearishStopLoss, setBearishStopLoss] = useState<PriceLevelData>({ price: null, label: 'وقف خسارة هبوطي' });
  
  // تحديث المستويات بناءً على سجل البحث
  useEffect(() => {
    if (!searchHistory || !searchHistory.length) return;
    
    // الحصول على التحليلات الصعودية والهبوطية
    const bullishAnalyses = searchHistory.filter(item => 
      item.analysis?.direction === 'صاعد' && !item.stopLossHit && !item.targetHit
    );
    
    const bearishAnalyses = searchHistory.filter(item => 
      item.analysis?.direction === 'هابط' && !item.stopLossHit && !item.targetHit
    );
    
    console.log("تحليلات صعودية:", bullishAnalyses.length);
    console.log("تحليلات هبوطية:", bearishAnalyses.length);
    
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
      
      const closestBullishTarget = sortedBullishByTarget[0]?.analysis?.targets?.[0]?.price || null;
      if (closestBullishTarget) {
        setBullishTarget({ price: closestBullishTarget, label: 'هدف صعودي' });
      }
      
      // البحث عن أقرب وقف خسارة صعودي
      const sortedBullishByStopLoss = [...bullishAnalyses].sort((a, b) => {
        const aStopLoss = a.analysis?.stopLoss || 0;
        const bStopLoss = b.analysis?.stopLoss || 0;
        
        // نريد وقف الخسارة الأقرب للسعر الحالي (الأكبر قيمة لوقف الخسارة)
        return bStopLoss - aStopLoss;
      });
      
      const closestBullishStopLoss = sortedBullishByStopLoss[0]?.analysis?.stopLoss || null;
      if (closestBullishStopLoss) {
        setBullishStopLoss({ price: closestBullishStopLoss, label: 'وقف خسارة صعودي' });
      }
    }
    
    // البحث عن أقرب هدف هبوطي
    if (bearishAnalyses.length > 0) {
      console.log("معالجة التحليلات الهبوطية:", bearishAnalyses);
      
      // ترتيب التحليلات حسب الهدف الأول (الأقرب للسعر الحالي)
      const sortedBearishByTarget = [...bearishAnalyses].sort((a, b) => {
        const aTarget = a.analysis?.targets?.[0]?.price || 0;
        const bTarget = b.analysis?.targets?.[0]?.price || 0;
        
        console.log(`مقارنة أهداف هبوطية: a=${aTarget}, b=${bTarget}`);
        
        // نريد الهدف الأقرب للسعر الحالي (الأصغر فارقًا)
        if (currentPrice) {
          return Math.abs(aTarget - currentPrice) - Math.abs(bTarget - currentPrice);
        }
        return bTarget - aTarget; // للهبوطي نريد القيمة الأصغر
      });
      
      const closestBearishTarget = sortedBearishByTarget[0]?.analysis?.targets?.[0]?.price || null;
      console.log("أقرب هدف هبوطي:", closestBearishTarget);
      
      if (closestBearishTarget) {
        setBearishTarget({ price: closestBearishTarget, label: 'هدف هبوطي' });
      }
      
      // البحث عن أقرب وقف خسارة هبوطي
      const sortedBearishByStopLoss = [...bearishAnalyses].sort((a, b) => {
        const aStopLoss = a.analysis?.stopLoss || Number.MAX_VALUE;
        const bStopLoss = b.analysis?.stopLoss || Number.MAX_VALUE;
        
        // نريد وقف الخسارة الأقرب للسعر الحالي (الأصغر قيمة لوقف الخسارة)
        return aStopLoss - bStopLoss;
      });
      
      const closestBearishStopLoss = sortedBearishByStopLoss[0]?.analysis?.stopLoss || null;
      if (closestBearishStopLoss) {
        setBearishStopLoss({ price: closestBearishStopLoss, label: 'وقف خسارة هبوطي' });
      }
    }
    
    // التحقق من تجاوز السعر للأهداف ووقف الخسارة
    if (currentPrice) {
      // تحقق الأهداف الصعودية
      if (bullishTarget.price !== null && currentPrice >= bullishTarget.price) {
        console.log("تم تحقيق الهدف الصعودي:", bullishTarget.price);
        // يمكن تنفيذ منطق إضافي هنا مثل تحديث الهدف التالي
      }
      
      // تحقق وقف الخسارة الصعودي
      if (bullishStopLoss.price !== null && currentPrice <= bullishStopLoss.price) {
        console.log("تم تفعيل وقف الخسارة الصعودي:", bullishStopLoss.price);
        // يمكن تنفيذ منطق إضافي هنا
      }
      
      // تحقق الأهداف الهبوطية
      if (bearishTarget.price !== null && currentPrice <= bearishTarget.price) {
        console.log("تم تحقيق الهدف الهبوطي:", bearishTarget.price);
        // يمكن تنفيذ منطق إضافي هنا
      }
      
      // تحقق وقف الخسارة الهبوطي
      if (bearishStopLoss.price !== null && currentPrice >= bearishStopLoss.price) {
        console.log("تم تفعيل وقف الخسارة الهبوطي:", bearishStopLoss.price);
        // يمكن تنفيذ منطق إضافي هنا
      }
    }
    
  }, [searchHistory, currentPrice]);
  
  // تنسيق الرقم لعرض 2 أرقام عشرية
  const formatPrice = (price: number | null) => {
    if (price === null) return "-";
    return price.toFixed(2);
  };
  
  return (
    <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-md">
      <div className="space-y-3">
        {/* السعر الحالي */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-1">السعر الحالي</h3>
          <div className="text-2xl font-bold bg-slate-200 dark:bg-slate-700 rounded-md py-1 px-3 inline-block">
            {currentPrice ? formatPrice(currentPrice) : "جاري التحميل..."}
          </div>
        </div>
        
        {/* الأهداف ووقف الخسارة */}
        <div className="grid grid-cols-2 gap-3 text-center">
          {/* الاتجاه الصعودي */}
          <div className="space-y-2">
            {/* هدف صعودي */}
            <div 
              className="p-2 rounded-md bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-900" 
              style={{ boxShadow: "0 0 10px rgba(34, 197, 94, 0.2)" }}
            >
              <div className="text-sm text-muted-foreground mb-1">{bullishTarget.label}</div>
              <div className="font-semibold text-green-700 dark:text-green-400">{formatPrice(bullishTarget.price)}</div>
            </div>
            
            {/* وقف خسارة صعودي */}
            <div 
              className="p-2 rounded-md bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900" 
              style={{ boxShadow: "0 0 10px rgba(239, 68, 68, 0.2)" }}
            >
              <div className="text-sm text-muted-foreground mb-1">{bullishStopLoss.label}</div>
              <div className="font-semibold text-red-700 dark:text-red-400">{formatPrice(bullishStopLoss.price)}</div>
            </div>
          </div>
          
          {/* الاتجاه الهبوطي */}
          <div className="space-y-2">
            {/* هدف هبوطي */}
            <div 
              className="p-2 rounded-md bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-900" 
              style={{ boxShadow: "0 0 10px rgba(34, 197, 94, 0.2)" }}
            >
              <div className="text-sm text-muted-foreground mb-1">{bearishTarget.label}</div>
              <div className="font-semibold text-green-700 dark:text-green-400">{formatPrice(bearishTarget.price)}</div>
            </div>
            
            {/* وقف خسارة هبوطي */}
            <div 
              className="p-2 rounded-md bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900" 
              style={{ boxShadow: "0 0 10px rgba(239, 68, 68, 0.2)" }}
            >
              <div className="text-sm text-muted-foreground mb-1">{bearishStopLoss.label}</div>
              <div className="font-semibold text-red-700 dark:text-red-400">{formatPrice(bearishStopLoss.price)}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
