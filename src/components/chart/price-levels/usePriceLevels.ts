
import { useState, useCallback } from 'react';
import { SearchHistoryItem } from '@/types/analysis';
import { PriceLevelData } from './types';

export function usePriceLevels() {
  const [bullishTarget, setBullishTarget] = useState<PriceLevelData>({ price: null, label: 'هدف صعودي' });
  const [bullishStopLoss, setBullishStopLoss] = useState<PriceLevelData>({ price: null, label: 'وقف خسارة صعودي' });
  const [bearishTarget, setBearishTarget] = useState<PriceLevelData>({ price: null, label: 'هدف هبوطي' });
  const [bearishStopLoss, setBearishStopLoss] = useState<PriceLevelData>({ price: null, label: 'وقف خسارة هبوطي' });

  const updatePriceLevels = useCallback((searchHistory: SearchHistoryItem[], currentPrice: number | null) => {
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
  }, [bullishTarget.price, bullishStopLoss.price, bearishTarget.price, bearishStopLoss.price]);

  return {
    bullishTarget,
    bullishStopLoss,
    bearishTarget,
    bearishStopLoss,
    updatePriceLevels
  };
}
