
/**
 * Events dispatched during analysis checking process
 */

/**
 * Dispatch event when analyses are successfully checked
 */
export const dispatchAnalysisSuccessEvent = (data: any) => {
  window.dispatchEvent(new CustomEvent('analyses-checked', { 
    detail: { 
      timestamp: data.timestamp || data.currentTime, 
      checkedCount: data.checked || 0, 
      symbol: data.symbol 
    }
  }));
  
  window.dispatchEvent(new CustomEvent('historyUpdated', { 
    detail: { timestamp: data.timestamp || data.currentTime }
  }));
};

/**
 * Dispatch event when analysis check fails
 */
export const dispatchErrorEvent = (error: unknown, consecutiveErrors: number) => {
  window.dispatchEvent(new CustomEvent('analyses-check-failed', { 
    detail: { 
      error: error instanceof Error ? error.message : String(error),
      consecutiveErrors: consecutiveErrors + 1,
      lastErrorTime: new Date(),
      isOnline: navigator.onLine
    }
  }));
};
