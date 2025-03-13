
import React from 'react';
import { InfoIcon } from 'lucide-react';

interface EmptyHistoryMessageProps {
  intervalSeconds: string;
}

export const EmptyHistoryMessage: React.FC<EmptyHistoryMessageProps> = ({ intervalSeconds }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <InfoIcon className="h-8 w-8 mx-auto mb-2" />
      <p>لا توجد بيانات لعرضها بعد</p>
      <p className="text-sm">سيتم تسجيل الأسعار تلقائياً كل {parseFloat(intervalSeconds)} ثانية</p>
    </div>
  );
};
