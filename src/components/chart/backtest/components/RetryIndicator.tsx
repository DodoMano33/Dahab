
import { RefreshCw } from "lucide-react";

type RetryIndicatorProps = {
  retryCount: number;
};

export const RetryIndicator = ({ retryCount }: RetryIndicatorProps) => {
  if (retryCount <= 0) return null;
  
  return (
    <div className="flex items-center text-yellow-600 text-xs mt-1 gap-1">
      <RefreshCw size={14} className="animate-spin" />
      <span>محاولة إعادة الاتصال ({retryCount})...</span>
    </div>
  );
};
