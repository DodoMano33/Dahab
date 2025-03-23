
import React from 'react';

interface PriceIndicatorProps {
  currentPrice: number | null;
}

export const PriceIndicator: React.FC<PriceIndicatorProps> = ({ currentPrice }) => {
  // تنسيق الرقم لعرض 2 أرقام عشرية
  const formatPrice = (price: number | null) => {
    if (price === null) return "جاري التحميل...";
    return price.toFixed(2);
  };

  return (
    <div className="text-center mb-4">
      <h3 className="text-lg font-semibold mb-1">السعر الحالي</h3>
      <div className="text-2xl font-bold bg-slate-200 dark:bg-slate-700 rounded-md py-1 px-3 inline-block">
        {formatPrice(currentPrice)}
      </div>
    </div>
  );
};
