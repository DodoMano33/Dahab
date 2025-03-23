
import { ArrowUp, ArrowDown } from 'lucide-react';
import { PriceDirection } from './types';

interface CurrentPriceDisplayProps {
  currentPrice: number | null;
  priceDirection: PriceDirection;
  formatPrice: (price: number | null) => string;
  getPriceBackgroundColor: () => string;
}

export const CurrentPriceDisplay = ({
  currentPrice,
  priceDirection,
  formatPrice,
  getPriceBackgroundColor
}: CurrentPriceDisplayProps) => {
  return (
    <div className="text-center mb-4">
      <h3 className="text-lg font-semibold mb-1">السعر الحالي</h3>
      <div className={`text-2xl font-bold rounded-md py-1.5 px-4 inline-flex items-center gap-1.5 transition-all duration-500 border ${getPriceBackgroundColor()}`}>
        {priceDirection === 'up' && <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400 animate-pulse" />}
        {priceDirection === 'down' && <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400 animate-pulse" />}
        <span className={priceDirection === 'up' ? 'text-green-700 dark:text-green-400' : priceDirection === 'down' ? 'text-red-700 dark:text-red-400' : ''}>
          {currentPrice ? formatPrice(currentPrice) : "جاري التحميل..."}
        </span>
      </div>
    </div>
  );
};
