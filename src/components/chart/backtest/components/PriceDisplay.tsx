
import { TradingViewStats } from '../../TradingViewStats';

type PriceDisplayProps = {
  currentPrice: number | null;
  priceUpdateCount: number;
};

export const PriceDisplay = ({ currentPrice, priceUpdateCount }: PriceDisplayProps) => {
  return (
    <div className="bg-gray-900 text-white p-3 rounded-md">
      {currentPrice ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-green-600">
            السعر الحالي: {currentPrice} (تم التحديث {priceUpdateCount} مرة)
          </p>
          <TradingViewStats />
        </div>
      ) : (
        <p className="text-xs font-semibold text-yellow-600">
          بانتظار السعر... (سيتم المحاولة مجددًا)
        </p>
      )}
    </div>
  );
};
