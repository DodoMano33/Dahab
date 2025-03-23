
import React from 'react';
import { PriceLevelCard } from './PriceLevelCard';
import { PriceLevelData } from './types';

interface PriceLevelsGridProps {
  bullishTarget: PriceLevelData;
  bullishStopLoss: PriceLevelData;
  bearishTarget: PriceLevelData;
  bearishStopLoss: PriceLevelData;
}

export const PriceLevelsGrid: React.FC<PriceLevelsGridProps> = ({ 
  bullishTarget, 
  bullishStopLoss, 
  bearishTarget, 
  bearishStopLoss 
}) => {
  // تنسيق الرقم لعرض 2 أرقام عشرية
  const formatPrice = (price: number | null) => {
    if (price === null) return "-";
    return price.toFixed(2);
  };
  
  return (
    <div className="grid grid-cols-2 gap-3 text-center">
      {/* الاتجاه الصعودي */}
      <div className="space-y-2">
        {/* هدف صعودي */}
        <PriceLevelCard
          label={bullishTarget.label}
          price={bullishTarget.price}
          type="target"
          direction="bullish"
        />
        
        {/* وقف خسارة صعودي */}
        <PriceLevelCard
          label={bullishStopLoss.label}
          price={bullishStopLoss.price}
          type="stopLoss"
          direction="bullish"
        />
      </div>
      
      {/* الاتجاه الهبوطي */}
      <div className="space-y-2">
        {/* هدف هبوطي */}
        <PriceLevelCard
          label={bearishTarget.label}
          price={bearishTarget.price}
          type="target"
          direction="bearish"
        />
        
        {/* وقف خسارة هبوطي */}
        <PriceLevelCard
          label={bearishStopLoss.label}
          price={bearishStopLoss.price}
          type="stopLoss"
          direction="bearish"
        />
      </div>
    </div>
  );
};
