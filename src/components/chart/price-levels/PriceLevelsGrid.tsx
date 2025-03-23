
import { PriceLevelCard } from './PriceLevelCard';
import { PriceLevelData } from './usePriceLevels';

interface PriceLevelsGridProps {
  bullishTarget: PriceLevelData;
  bullishStopLoss: PriceLevelData;
  bearishTarget: PriceLevelData;
  bearishStopLoss: PriceLevelData;
  formatPrice: (price: number | null) => string;
}

export const PriceLevelsGrid = ({
  bullishTarget,
  bullishStopLoss,
  bearishTarget,
  bearishStopLoss,
  formatPrice
}: PriceLevelsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 text-center">
      {/* الاتجاه الصعودي */}
      <div className="space-y-2">
        {/* هدف صعودي */}
        <PriceLevelCard
          data={bullishTarget}
          formatPrice={formatPrice}
          type="target"
        />
        
        {/* وقف خسارة صعودي */}
        <PriceLevelCard
          data={bullishStopLoss}
          formatPrice={formatPrice}
          type="stopLoss"
        />
      </div>
      
      {/* الاتجاه الهبوطي */}
      <div className="space-y-2">
        {/* هدف هبوطي */}
        <PriceLevelCard
          data={bearishTarget}
          formatPrice={formatPrice}
          type="target"
        />
        
        {/* وقف خسارة هبوطي */}
        <PriceLevelCard
          data={bearishStopLoss}
          formatPrice={formatPrice}
          type="stopLoss"
        />
      </div>
    </div>
  );
};
