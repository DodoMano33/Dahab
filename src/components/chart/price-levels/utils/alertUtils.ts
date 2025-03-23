
import { toast } from 'sonner';
import React from 'react';

// عرض إشعار نجاح تحقيق الهدف
export const showTargetHitAlert = (price: number, direction: string) => {
  toast.success(
    () => {
      return (
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="font-bold">تم تحقيق الهدف {direction === 'صعودي' ? 'الصعودي' : 'الهبوطي'}</div>
          <div>السعر: {price}</div>
        </div>
      );
    }, 
    {
      position: "top-center",
      duration: 4000,
    }
  );
};

// عرض إشعار تفعيل وقف الخسارة
export const showStopLossHitAlert = (price: number, direction: string) => {
  toast.error(
    () => {
      return (
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="font-bold">تم تفعيل وقف الخسارة {direction === 'صعودي' ? 'الصعودي' : 'الهبوطي'}</div>
          <div>السعر: {price}</div>
        </div>
      );
    }, 
    {
      position: "top-center",
      duration: 4000,
    }
  );
};
