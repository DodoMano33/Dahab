
import { useEffect, useRef } from 'react';
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
  
  // استخدام مرجع لتخزين معرف المؤقت
  const autoCheckIntervalRef = useRef<number | undefined>(undefined);
  
  useEffect(() => {
    // تنظيف المؤقت السابق قبل إعداد مؤقت جديد
    if (autoCheckIntervalRef.current !== undefined) {
      console.log('Cleaning up previous auto-check interval');
      window.clearInterval(autoCheckIntervalRef.current);
      autoCheckIntervalRef.current = undefined;
    }
    
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
    
    // إعداد الاستماع للأحداث المخصصة
    window.addEventListener('manual-check-analyses', handleManualCheck);
    window.addEventListener('autoCheckRequested', () => {
      handleManualCheck();
    });

    // إعداد مؤقت الفحص التلقائي بفاصل زمني أطول لمنع الضغط على الخادم
    autoCheckIntervalRef.current = window.setInterval(() => {
      // فحص إذا كان التطبيق في حالة عدم نشاط
      if (document.hidden) {
        console.log('App is in background, skipping auto check');
        return;
      }
      
      const price = currentPriceRef.current;
      
      // تخطي الفحص التلقائي إذا كان آخر خطأ حدث منذ أقل من دقيقتين (زيادة الفاصل الزمني)
      if (lastErrorTime && (new Date().getTime() - lastErrorTime.getTime() < 120000)) {
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
    }, 30000); // زيادة الفاصل الزمني إلى 30 ثانية لتقليل عدد الطلبات

    return () => {
      console.log('Cleaning up useAnalysisChecker effect');
      window.removeEventListener('manual-check-analyses', handleManualCheck);
      window.removeEventListener('autoCheckRequested', handleManualCheck);
      
      if (autoCheckIntervalRef.current !== undefined) {
        window.clearInterval(autoCheckIntervalRef.current);
        autoCheckIntervalRef.current = undefined;
      }
      
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
