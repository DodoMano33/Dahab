
import { useState } from "react";

export const useAnalysisState = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');
  
  return {
    currentAnalysis,
    setCurrentAnalysis
  };
};
