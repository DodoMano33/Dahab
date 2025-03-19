
type PriceDisplayProps = {
  currentPrice: number | null;
  priceUpdateCount: number;
};

export const PriceDisplay = ({ currentPrice, priceUpdateCount }: PriceDisplayProps) => {
  if (currentPrice) {
    return (
      <p className="text-xs font-semibold text-green-600 mt-1">
        السعر الحالي من Alpha Vantage: {currentPrice} (تم التحديث {priceUpdateCount} مرة)
      </p>
    );
  }
  
  return (
    <p className="text-xs font-semibold text-yellow-600 mt-1">
      بانتظار السعر من Alpha Vantage... (سيتم المحاولة مجددًا)
    </p>
  );
};
