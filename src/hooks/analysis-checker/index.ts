
import { useEffect } from 'react';
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

  useEffect(() => {
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

    const autoCheckInterval = setInterval(() => {
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
    }, 10000);

    return () => {
      window.removeEventListener('manual-check-analyses', handleManualCheck);
      clearInterval(autoCheckInterval);
      clearPendingRequests();
    };
  }, [symbol, currentPriceRef, lastErrorTime, consecutiveErrors, checkAnalyses, clearPendingRequests]);

  return {
    isChecking,
    lastErrorTime,
    consecutiveErrors,
    retryCount
  };
};
