
import { useRef, useEffect } from 'react';

/**
 * Hook for managing interval-based functionality with cleanup
 */
export const useIntervalControl = (
  callback: () => void,
  interval: number,
  dependencies: any[] = [],
  skipWhenHidden: boolean = true
) => {
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Clean up previous interval if it exists
    if (intervalRef.current !== undefined) {
      console.log('Cleaning up previous interval');
      window.clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    // Set up the new interval
    intervalRef.current = window.setInterval(() => {
      // Skip execution if document is hidden and skipWhenHidden is true
      if (skipWhenHidden && document.hidden) {
        console.log('App is in background, skipping interval execution');
        return;
      }
      
      callback();
    }, interval);

    // Clean up on unmount
    return () => {
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    clear: () => {
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    }
  };
};
