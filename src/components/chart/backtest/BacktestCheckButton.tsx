
import { memo } from "react";

export const BacktestCheckButton = memo(() => (
  <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border">
    <div className="flex flex-col">
      <h3 className="text-lg font-medium">فحص التحليلات</h3>
      <p className="text-muted-foreground text-sm">فحص التحليلات الحالية ومقارنتها بالأسعار الحالية</p>
    </div>
    <button
      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md cursor-default"
    >
      فحص الآن
    </button>
  </div>
));

BacktestCheckButton.displayName = 'BacktestCheckButton';
