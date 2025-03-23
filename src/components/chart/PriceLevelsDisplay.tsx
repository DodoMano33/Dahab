
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useCurrentPrice } from '@/hooks/current-price';
import { useSearchHistory } from '../hooks/search-history';
import { PriceIndicator } from './price-levels/PriceIndicator';
import { PriceLevelsGrid } from './price-levels/PriceLevelsGrid';
import { usePriceLevels } from './price-levels/usePriceLevels';

export const PriceLevelsDisplay = () => {
  const { currentPrice } = useCurrentPrice();
  const { searchHistory } = useSearchHistory();
  const { 
    bullishTarget, 
    bearishTarget, 
    bullishStopLoss, 
    bearishStopLoss,
    updatePriceLevels
  } = usePriceLevels();
  
  // تحديث المستويات بناءً على سجل البحث
  useEffect(() => {
    if (!searchHistory || !searchHistory.length) return;
    updatePriceLevels(searchHistory, currentPrice);
  }, [searchHistory, currentPrice, updatePriceLevels]);
  
  return (
    <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-md">
      <div className="space-y-3">
        {/* السعر الحالي */}
        <PriceIndicator currentPrice={currentPrice} />
        
        {/* الأهداف ووقف الخسارة */}
        <PriceLevelsGrid 
          bullishTarget={bullishTarget}
          bullishStopLoss={bullishStopLoss}
          bearishTarget={bearishTarget}
          bearishStopLoss={bearishStopLoss}
        />
      </div>
    </Card>
  );
};
