
import { useEffect, useState } from 'react';
import { useAnalysisCheckerProcess } from './useAnalysisCheckerProcess';
import { AnalysisCheckerProps, UseAnalysisCheckerResult } from './types';

export const useAnalysisChecker = ({ 
  symbol, 
  currentPriceRef 
}: AnalysisCheckerProps): UseAnalysisCheckerResult => {
  const { 
    isChecking, 
    lastErrorTime, 
    consecutiveErrors, 
    retryCount, 
    checkAnalyses,
    clearPendingRequests
  } = useAnalysisCheckerProcess();

  const [autoCheckInterval, setAutoCheckInterval] = useState<number>(30000); // القيمة الافتراضية 30 ثانية

  useEffect(() => {
    // الاستماع لتغييرات إعدادات المستخدم
    const handleSettingsUpdate = ((event: CustomEvent) => {
      if (event.detail && event.detail.autoCheckInterval) {
        setAutoCheckInterval(event.detail.autoCheckInterval * 1000);
      }
    }) as EventListener;

    window.addEventListener('user-settings-updated', handleSettingsUpdate);

    const handleManualCheck = () => {
      console.log('Manual check requested, current price:', currentPriceRef.current);
      const price = currentPriceRef.current;
      
      if (price !== null) {
        console.log('Executing manual check with price:', price);
        checkAnalyses({ price, symbol, isManualCheck: true });
      } else {
        console.warn('Manual check requested but current price is null');
        checkAnalyses({ price: null, symbol, isManualCheck: true });
      }
    };
    
    window.addEventListener('manual-check-analyses', handleManualCheck);

    const autoCheckIntervalId = setInterval(() => {
      const price = currentPriceRef.current;
      
      // تخطي الفحص التلقائي إذا كان آخر خطأ حدث منذ أقل من دقيقة واحدة
      if (lastErrorTime && (new Date().getTime() - lastErrorTime.getTime() < 60000)) {
        console.log('Skipping auto check due to recent error');
        return;
      }
      
      if (price !== null) {
        console.log('Auto check triggered with price:', price);
        checkAnalyses({ price, symbol });
      } else {
        console.warn('Auto check skipped, current price is null');
        checkAnalyses({ price: null, symbol });
      }
    }, autoCheckInterval);

    return () => {
      window.removeEventListener('manual-check-analyses', handleManualCheck);
      window.removeEventListener('user-settings-updated', handleSettingsUpdate);
      clearInterval(autoCheckIntervalId);
      clearPendingRequests();
    };
  }, [symbol, currentPriceRef, lastErrorTime, consecutiveErrors, checkAnalyses, clearPendingRequests, autoCheckInterval]);

  return {
    isChecking,
    lastErrorTime,
    consecutiveErrors,
    retryCount
  };
};
