
import { SearchHistoryItem } from "@/types/analysis";
import { PriceLevelData } from "../types";

// استخراج التحليلات الصعودية والهبوطية النشطة
export const extractActiveAnalyses = (searchHistory: SearchHistoryItem[] = []) => {
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
  
  return { bullishAnalyses, bearishAnalyses };
};

// العثور على أقرب هدف صعودي
export const findClosestBullishTarget = (bullishAnalyses: SearchHistoryItem[], currentPrice: number | null): PriceLevelData => {
  if (bullishAnalyses.length === 0 || !currentPrice) {
    return { price: null, label: 'هدف صعودي' };
  }
  
  // ترتيب التحليلات حسب الهدف الأول (الأقرب للسعر الحالي)
  const sortedBullishByTarget = [...bullishAnalyses].sort((a, b) => {
    const aTarget = a.analysis?.targets?.[0]?.price || Number.MAX_VALUE;
    const bTarget = b.analysis?.targets?.[0]?.price || Number.MAX_VALUE;
    
    // نريد الهدف الأقرب للسعر الحالي (الأصغر فارقًا)
    return Math.abs(aTarget - currentPrice) - Math.abs(bTarget - currentPrice);
  });
  
  const closestBullish = sortedBullishByTarget[0];
  const closestBullishTarget = closestBullish?.analysis?.targets?.[0]?.price || null;
  
  console.log("أقرب هدف صعودي:", closestBullishTarget);
  
  return { 
    price: closestBullishTarget, 
    label: 'هدف صعودي',
    id: closestBullish.id
  };
};

// العثور على أقرب وقف خسارة صعودي
export const findClosestBullishStopLoss = (bullishAnalyses: SearchHistoryItem[], currentPrice: number | null): PriceLevelData => {
  if (bullishAnalyses.length === 0 || !currentPrice) {
    return { price: null, label: 'وقف خسارة صعودي' };
  }
  
  // ترتيب التحليلات حسب وقف الخسارة
  const sortedBullishByStopLoss = [...bullishAnalyses].sort((a, b) => {
    const aStopLoss = a.analysis?.stopLoss || 0;
    const bStopLoss = b.analysis?.stopLoss || 0;
    
    // نريد وقف الخسارة الأقرب للسعر الحالي (الأكبر قيمة لوقف الخسارة)
    return bStopLoss - aStopLoss;
  });
  
  const closestBullishStopLossAnalysis = sortedBullishByStopLoss[0];
  const closestBullishStopLoss = closestBullishStopLossAnalysis?.analysis?.stopLoss || null;
  
  console.log("أقرب وقف خسارة صعودي:", closestBullishStopLoss);
  
  return { 
    price: closestBullishStopLoss, 
    label: 'وقف خسارة صعودي',
    id: closestBullishStopLossAnalysis.id
  };
};

// العثور على أقرب هدف هبوطي
export const findClosestBearishTarget = (bearishAnalyses: SearchHistoryItem[], currentPrice: number | null): PriceLevelData => {
  if (bearishAnalyses.length === 0 || !currentPrice) {
    return { price: null, label: 'هدف هبوطي' };
  }
  
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
  
  return { 
    price: closestBearishTarget, 
    label: 'هدف هبوطي',
    id: closestBearish.id 
  };
};

// العثور على أقرب وقف خسارة هبوطي
export const findClosestBearishStopLoss = (bearishAnalyses: SearchHistoryItem[], currentPrice: number | null): PriceLevelData => {
  if (bearishAnalyses.length === 0 || !currentPrice) {
    return { price: null, label: 'وقف خسارة هبوطي' };
  }
  
  // ترتيب التحليلات حسب وقف الخسارة
  const sortedBearishByStopLoss = [...bearishAnalyses].sort((a, b) => {
    const aStopLoss = a.analysis?.stopLoss || 0;
    const bStopLoss = b.analysis?.stopLoss || 0;
    
    // للهبوطي نريد وقف الخسارة الأكبر من السعر الحالي
    return aStopLoss - bStopLoss; // ترتيب تصاعدي
  });
  
  const closestBearishStopLossAnalysis = sortedBearishByStopLoss[0];
  const closestBearishStopLoss = closestBearishStopLossAnalysis?.analysis?.stopLoss || null;
  
  console.log("أقرب وقف خسارة هبوطي:", closestBearishStopLoss);
  
  return { 
    price: closestBearishStopLoss, 
    label: 'وقف خسارة هبوطي',
    id: closestBearishStopLossAnalysis.id 
  };
};
