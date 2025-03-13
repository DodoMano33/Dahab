
import { useEffect, useRef } from 'react';

interface ExtractionTimerOptions {
  interval: number;
  enabled: boolean;
  extractOnMount: boolean;
  debugMode: boolean;
  extractFunction: () => void;
}

/**
 * هوك لإدارة مؤقت استخراج السعر
 */
export const useExtractionTimer = ({
  interval,
  enabled,
  extractOnMount,
  debugMode,
  extractFunction
}: ExtractionTimerOptions) => {
  const extractionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (debugMode) {
      console.log(`Setting up price extraction interval: ${interval}ms`);
    }
    
    // استخراج السعر فورًا عند التحميل
    if (extractOnMount) {
      extractFunction();
    }
    
    // إعداد استخراج السعر على فترات منتظمة
    extractionTimerRef.current = setInterval(extractFunction, interval);
    
    return () => {
      if (extractionTimerRef.current) {
        clearInterval(extractionTimerRef.current);
        extractionTimerRef.current = null;
      }
    };
  }, [interval, enabled, extractFunction, extractOnMount, debugMode]);

  return {
    clearTimer: () => {
      if (extractionTimerRef.current) {
        clearInterval(extractionTimerRef.current);
        extractionTimerRef.current = null;
      }
    }
  };
};
