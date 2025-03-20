
import { useState, useRef } from 'react';
import { priceUpdater } from '@/utils/price/updater';

interface UseTradingViewMessagesProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceUpdate?: (price: number) => void;
}

export const useTradingViewMessages = ({
  symbol,
  onSymbolChange,
  onPriceUpdate
}: UseTradingViewMessagesProps) => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const isComponentMountedRef = useRef<boolean>(true);
  const lastUpdateTimeRef = useRef<number>(0);

  // هذا الخطاف أصبح مجرد واجهة ولا يستخدم TradingView
  // بدلاً من ذلك، يتم استخدام Metal Price API مباشرة
  
  // يمكننا العودة ببساطة بقيم السعر الحالية لسهولة التكامل مع الكود الموجود
  return {
    currentPrice,
    priceUpdateCount
  };
};
