
import { PriceLevelData } from './usePriceLevels';

interface PriceLevelCardProps {
  data: PriceLevelData;
  formatPrice: (price: number | null) => string;
  type: 'target' | 'stopLoss';
}

export const PriceLevelCard = ({ data, formatPrice, type }: PriceLevelCardProps) => {
  const isTarget = type === 'target';
  
  // تحديد الألوان بناءً على نوع المستوى
  const bgColor = isTarget 
    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900' 
    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900';
  
  const textColor = isTarget 
    ? 'text-green-700 dark:text-green-400' 
    : 'text-red-700 dark:text-red-400';
  
  const shadowColor = isTarget 
    ? 'rgba(34, 197, 94, 0.2)' 
    : 'rgba(239, 68, 68, 0.2)';

  return (
    <div 
      className={`p-2 rounded-md ${bgColor} transition-all duration-300 hover:shadow-md hover:scale-[1.02]`} 
      style={{ boxShadow: `0 0 10px ${shadowColor}` }}
    >
      <div className="text-sm text-muted-foreground mb-1">{data.label}</div>
      <div className={`font-semibold ${textColor}`}>{formatPrice(data.price)}</div>
    </div>
  );
};
