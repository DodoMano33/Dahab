
type PriceDisplayProps = {
  currentPrice: number | null;
  priceUpdateCount: number;
};

export const PriceDisplay = ({ currentPrice, priceUpdateCount }: PriceDisplayProps) => {
  if (currentPrice) {
    return (
      <p className="text-xs font-semibold text-green-600 mt-1">
        السعر الحالي من Metal Price API: {currentPrice} (تم التحديث {priceUpdateCount} مرة)
      </p>
    );
  }
  
  return (
    <p className="text-xs font-semibold text-yellow-600 mt-1">
      جارٍ جلب السعر من Metal Price API...
    </p>
  );
};
