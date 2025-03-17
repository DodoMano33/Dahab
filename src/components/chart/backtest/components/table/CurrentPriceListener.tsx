
import React, { useEffect, useState } from 'react';

interface CurrentPriceListenerProps {
  children: (currentPrice: number) => React.ReactNode;
}

export const CurrentPriceListener: React.FC<CurrentPriceListenerProps> = ({ children }) => {
  const [currentPrice, setCurrentPrice] = useState<number>(100); // استخدام قيمة ثابتة بدلاً من السعر الفعلي

  // تعليق استدعاء السعر الحقيقي
  useEffect(() => {
    console.log("Using fixed price value:", currentPrice);
    // لا نقوم بأي عملية تحديث للسعر، نستخدم القيمة الثابتة فقط
  }, []);

  return <>{children(currentPrice)}</>;
};
