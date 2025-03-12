
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useAnalysisErrors = () => {
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    // الاستماع لفشل فحص التحليلات
    const handleCheckFailure = (event: CustomEvent) => {
      const errorMsg = event.detail?.error || 'خطأ غير معروف';
      console.error("Analysis check failed:", errorMsg, event.detail);
      setHasNetworkError(true);
      setErrorDetails(errorMsg);
      toast.error(`فشل في فحص التحليلات: ${errorMsg}`);
    };
    
    window.addEventListener('analyses-check-failed', handleCheckFailure as EventListener);
    
    // الاستماع لتحديثات التاريخ لإعادة تعيين حالة الخطأ
    const handleHistoryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.timestamp) {
        console.log("useAnalysisErrors detected history update with timestamp:", customEvent.detail.timestamp);
        setHasNetworkError(false);
        setErrorDetails(null);
      } else {
        console.log("useAnalysisErrors detected history update event");
      }
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    
    return () => {
      window.removeEventListener('analyses-check-failed', handleCheckFailure as EventListener);
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, []);

  const resetErrors = () => {
    setHasNetworkError(false);
    setErrorDetails(null);
  };

  return { hasNetworkError, errorDetails, resetErrors };
};
