
import { useState, useCallback } from 'react';

interface UseOcrProcessorResult {
  isProcessingOCR: boolean;
}

export const useOcrProcessor = (): UseOcrProcessorResult => {
  const [isProcessingOCR, setIsProcessingOCR] = useState<boolean>(false);

  return {
    isProcessingOCR
  };
};
