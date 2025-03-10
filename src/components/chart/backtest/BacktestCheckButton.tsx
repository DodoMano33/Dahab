
import { memo } from "react";

interface BacktestCheckButtonProps {
  onCheck: () => void;
  isLoading: boolean;
  lastCheckTime: Date | null;
}

export const BacktestCheckButton = memo(({ 
  onCheck, 
  isLoading, 
  lastCheckTime 
}: BacktestCheckButtonProps) => (
  <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border">
    <div className="flex flex-col">
      <h3 className="text-lg font-medium">فحص التحليلات</h3>
      <p className="text-muted-foreground text-sm">فحص التحليلات الحالية ومقارنتها بالأسعار الحالية</p>
      {lastCheckTime && <p className="text-sm text-muted-foreground mt-1">آخر فحص: {lastCheckTime.toLocaleTimeString()}</p>}
    </div>
    <button
      onClick={onCheck}
      disabled={isLoading}
      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
    >
      {isLoading ? 'جاري الفحص...' : 'فحص الآن'}
    </button>
  </div>
));

BacktestCheckButton.displayName = 'BacktestCheckButton';
