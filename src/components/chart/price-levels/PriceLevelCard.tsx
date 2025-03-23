
import React from 'react';

interface PriceLevelCardProps {
  label: string;
  price: number | null;
  type: 'target' | 'stopLoss';
  direction: 'bullish' | 'bearish';
}

export const PriceLevelCard: React.FC<PriceLevelCardProps> = ({ 
  label, 
  price, 
  type, 
  direction 
}) => {
  // تنسيق الرقم لعرض 2 أرقام عشرية
  const formatPrice = (price: number | null) => {
    if (price === null) return "-";
    return price.toFixed(2);
  };
  
  // تحديد خلفية ولون الحدود بناءً على النوع
  const getBgAndBorderClasses = () => {
    if (type === 'target') {
      return "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-900";
    } else {
      return "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900";
    }
  };
  
  // تحديد لون النص بناءً على النوع
  const getTextColorClass = () => {
    if (type === 'target') {
      return "text-green-700 dark:text-green-400";
    } else {
      return "text-red-700 dark:text-red-400";
    }
  };
  
  // تحديد ظل العنصر بناءً على النوع
  const getShadowStyle = () => {
    if (type === 'target') {
      return { boxShadow: "0 0 10px rgba(34, 197, 94, 0.2)" };
    } else {
      return { boxShadow: "0 0 10px rgba(239, 68, 68, 0.2)" };
    }
  };

  return (
    <div 
      className={`p-2 rounded-md ${getBgAndBorderClasses()}`}
      style={getShadowStyle()}
    >
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className={`font-semibold ${getTextColorClass()}`}>{formatPrice(price)}</div>
    </div>
  );
};
