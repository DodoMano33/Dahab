
import { useState } from "react";

/**
 * هوك لإدارة حالة التحليل الحالية
 */
export function useAnalysisState() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const startAnalyzing = () => setIsAnalyzing(true);
  const stopAnalyzing = () => setIsAnalyzing(false);
  
  return {
    isAnalyzing,
    startAnalyzing,
    stopAnalyzing
  };
}
