
import { useCallback, useRef } from 'react';
import { useAnalysisCheckerProcess } from './useAnalysisCheckerProcess';
import { AnalysisCheckerProps, UseAnalysisCheckerResult } from './types';
import { useIntervalControl } from './hooks/useIntervalControl';
import { useManualCheckEvents } from './hooks/useManualCheckEvents';

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
  
  // Create manual check handler
  const handleManualCheck = useCallback(() => {
    console.log('Manual check requested, current price:', currentPriceRef.current);
    const price = currentPriceRef.current;
    
    if (price !== null) {
      console.log('Executing manual check with price:', price);
      checkAnalyses({ price, symbol, isManualCheck: true });
    } else {
      console.warn('Manual check requested but current price is null');
      checkAnalyses({ price: null, symbol, isManualCheck: true });
    }
  }, [currentPriceRef, symbol, checkAnalyses]);
  
  // Register event listeners for manual checks
  useManualCheckEvents(handleManualCheck);
  
  // Set up automated checking interval (30 seconds)
  useIntervalControl(() => {
    const price = currentPriceRef.current;
    
    // Skip auto check if there was a recent error (within last 2 minutes)
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
  }, 30000, [symbol, currentPriceRef.current, lastErrorTime, consecutiveErrors]);
  
  // Clean up all resources on unmount (handled by the hooks internally)
  
  return {
    isChecking,
    lastErrorTime,
    consecutiveErrors,
    retryCount
  };
};
