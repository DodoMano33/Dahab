
import { useEffect, useState, useRef } from 'react';
import { useCurrentPrice } from '@/hooks/current-price';
import { useSearchHistory } from '../../hooks/search-history';
import { PriceLevelData, PriceDirection } from './types';
import { formatPrice, getPriceBackgroundColor } from './utils/priceFormatters';
import { showTargetHitAlert, showStopLossHitAlert } from './utils/alertUtils';
import { 
  extractActiveAnalyses,
  findClosestBullishTarget,
  findClosestBullishStopLoss,
  findClosestBearishTarget,
  findClosestBearishStopLoss
} from './utils/analysisUtils';

export { PriceLevelData } from './types';

export const usePriceLevels = () => {
  const { currentPrice } = useCurrentPrice();
  const { searchHistory } = useSearchHistory();
  const prevPriceRef = useRef<number | null>(null);

  const [bullishTarget, setBullishTarget] = useState<PriceLevelData>({ price: null, label: 'هدف صعودي' });
  const [bullishStopLoss, setBullishStopLoss] = useState<PriceLevelData>({ price: null, label: 'وقف خسارة صعودي' });
  const [bearishTarget, setBearishTarget] = useState<PriceLevelData>({ price: null, label: 'هدف هبوطي' });
  const [bearishStopLoss, setBearishStopLoss] = useState<PriceLevelData>({ price: null, label: 'وقف خسارة هبوطي' });
  const [priceDirection, setPriceDirection] = useState<PriceDirection>(null);

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
    
    const { bullishAnalyses, bearishAnalyses } = extractActiveAnalyses(searchHistory);
    
    // تحديث الأهداف ووقف الخسارة
    setBullishTarget(findClosestBullishTarget(bullishAnalyses, currentPrice));
    setBullishStopLoss(findClosestBullishStopLoss(bullishAnalyses, currentPrice));
    setBearishTarget(findClosestBearishTarget(bearishAnalyses, currentPrice));
    setBearishStopLoss(findClosestBearishStopLoss(bearishAnalyses, currentPrice));
    
  }, [searchHistory, currentPrice]);
  
  // التحقق من تجاوز السعر للأهداف ووقف الخسارة
  useEffect(() => {
    if (!currentPrice) return;
    
    // تحقق الأهداف الصعودية
    if (bullishTarget.price !== null && bullishTarget.id && currentPrice >= bullishTarget.price) {
      console.log("تم تحقيق الهدف الصعودي:", bullishTarget.price);
      showTargetHitAlert(bullishTarget.price, 'صعودي');
      setBullishTarget({ price: null, label: 'هدف صعودي' });
    }
    
    // تحقق وقف الخسارة الصعودي
    if (bullishStopLoss.price !== null && bullishStopLoss.id && currentPrice <= bullishStopLoss.price) {
      console.log("تم تفعيل وقف الخسارة الصعودي:", bullishStopLoss.price);
      showStopLossHitAlert(bullishStopLoss.price, 'صعودي');
      setBullishStopLoss({ price: null, label: 'وقف خسارة صعودي' });
    }
    
    // تحقق الأهداف الهبوطية
    if (bearishTarget.price !== null && bearishTarget.id && currentPrice <= bearishTarget.price) {
      console.log("تم تحقيق الهدف الهبوطي:", bearishTarget.price);
      showTargetHitAlert(bearishTarget.price, 'هبوطي');
      setBearishTarget({ price: null, label: 'هدف هبوطي' });
    }
    
    // تحقق وقف الخسارة الهبوطي
    if (bearishStopLoss.price !== null && bearishStopLoss.id && currentPrice >= bearishStopLoss.price) {
      console.log("تم تفعيل وقف الخسارة الهبوطي:", bearishStopLoss.price);
      showStopLossHitAlert(bearishStopLoss.price, 'هبوطي');
      setBearishStopLoss({ price: null, label: 'وقف خسارة هبوطي' });
    }
    
  }, [currentPrice, bullishTarget, bullishStopLoss, bearishTarget, bearishStopLoss]);

  return {
    currentPrice,
    bullishTarget,
    bullishStopLoss,
    bearishTarget,
    bearishStopLoss,
    priceDirection,
    formatPrice,
    getPriceBackgroundColor: () => getPriceBackgroundColor(priceDirection)
  };
};
