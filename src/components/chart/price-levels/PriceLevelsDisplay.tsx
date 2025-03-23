
import { Card } from '@/components/ui/card';
import { CurrentPriceDisplay } from './CurrentPriceDisplay';
import { PriceLevelsGrid } from './PriceLevelsGrid';
import { usePriceLevels } from './usePriceLevels';

export const PriceLevelsDisplay = () => {
  const {
    currentPrice,
    bullishTarget,
    bullishStopLoss,
    bearishTarget,
    bearishStopLoss,
    priceDirection,
    formatPrice,
    getPriceBackgroundColor
  } = usePriceLevels();
  
  return (
    <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-md">
      <div className="space-y-3">
        {/* عرض السعر الحالي */}
        <CurrentPriceDisplay 
          currentPrice={currentPrice} 
          priceDirection={priceDirection}
          formatPrice={formatPrice}
          getPriceBackgroundColor={getPriceBackgroundColor}
        />
        
        {/* عرض مستويات الأسعار */}
        <PriceLevelsGrid 
          bullishTarget={bullishTarget}
          bullishStopLoss={bullishStopLoss}
          bearishTarget={bearishTarget}
          bearishStopLoss={bearishStopLoss}
          formatPrice={formatPrice}
        />
      </div>
    </Card>
  );
};
