
import { useEffect } from 'react';

/**
 * Hook for handling manual check events
 */
export const useManualCheckEvents = (
  handleManualCheck: () => void
) => {
  useEffect(() => {
    // Set up event listeners for manual checks
    window.addEventListener('manual-check-analyses', handleManualCheck);
    window.addEventListener('autoCheckRequested', handleManualCheck);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('manual-check-analyses', handleManualCheck);
      window.removeEventListener('autoCheckRequested', handleManualCheck);
    };
  }, [handleManualCheck]);
};
