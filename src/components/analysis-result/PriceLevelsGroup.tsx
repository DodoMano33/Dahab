
import { PriceLevelCard } from "./PriceLevelCard";

interface PriceLevelsGroupProps {
  support: number;
  resistance: number;
  stopLoss: number;
  currentPrice: number;
}

export const PriceLevelsGroup = ({ 
  support, 
  resistance, 
  stopLoss, 
  currentPrice 
}: PriceLevelsGroupProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <PriceLevelCard 
        title="مستوى الدعم" 
        value={support} 
        currentPrice={currentPrice} 
      />
      
      <PriceLevelCard 
        title="نقطة وقف الخسارة" 
        value={stopLoss} 
        currentPrice={currentPrice} 
      />
      
      <PriceLevelCard 
        title="مستوى المقاومة" 
        value={resistance} 
        currentPrice={currentPrice} 
      />
    </div>
  );
};
