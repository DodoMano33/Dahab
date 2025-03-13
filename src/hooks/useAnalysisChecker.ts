
import { useEffect } from 'react';
import { useAnalysisCheckerProcess } from './analysis-checker/useAnalysisCheckerProcess';
import { AnalysisCheckerProps, UseAnalysisCheckerResult } from './analysis-checker/types';

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
      
      // حتى في التحقق اليدوي، لا نرسل طلبًا بدون سعر
      if (price !== null) {
        console.log('Executing manual check with price:', price);
        checkAnalyses({ price, symbol, isManualCheck: true });
      } else {
        console.warn('Manual check requested but current price is null, will try to get price before check');
        // محاولة الحصول على السعر أولاً
        window.dispatchEvent(new Event('request-current-price'));
        
        // انتظار لحظة قصيرة للسماح بالاستجابة
        setTimeout(() => {
          const updatedPrice = currentPriceRef.current;
          if (updatedPrice !== null) {
            console.log('Price received, now executing manual check with price:', updatedPrice);
            checkAnalyses({ price: updatedPrice, symbol, isManualCheck: true });
          } else {
            console.error('Could not get current price for manual check, aborting check');
            window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
              detail: { 
                error: 'لا يمكن التحقق من التحليلات: لم يتم الحصول على السعر الحالي',
                consecutiveErrors: consecutiveErrors + 1,
                lastErrorTime: new Date()
              }
            }));
          }
        }, 500);
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
        // محاولة الحصول على السعر وإعادة المحاولة
        window.dispatchEvent(new Event('request-current-price'));
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
