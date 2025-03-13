
type PriceDisplayProps = {
  currentPrice: number | null;
  priceUpdateCount: number;
  priceSource?: string;
};

export const PriceDisplay = ({ currentPrice, priceUpdateCount, priceSource }: PriceDisplayProps) => {
  if (currentPrice) {
    return (
      <p className="text-xs font-semibold text-green-600 mt-1 flex flex-col">
        <span>
          السعر الحالي: {currentPrice} 
          {priceSource && <span className="text-gray-500 mr-1">({priceSource})</span>}
        </span>
        <span className="text-gray-500">
          تم التحديث {priceUpdateCount} مرة
        </span>
      </p>
    );
  }
  
  return (
    <p className="text-xs font-semibold text-yellow-600 mt-1 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      بانتظار السعر... (جاري محاولة الحصول على السعر)
    </p>
  );
};
