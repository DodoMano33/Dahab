
import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalysisOperations } from "./useAnalysisOperations";
import { useAnalysisValidation } from "./useAnalysisValidation";
import { AutoAnalysisConfig } from "../types/autoAnalysisTypes";

export const useAutoAnalysis = () => {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { validateAnalysisConfig } = useAnalysisValidation();
  const { performAnalysisCycle, stopAnalysisOperations } = useAnalysisOperations(
    setIsAnalyzing,
    abortControllerRef,
    intervalRef
  );

  const stopAutoAnalysis = () => {
    console.log("Stopping auto analysis");
    stopAnalysisOperations();
    setIsAnalyzing(false);
  };

  const startAutoAnalysis = async (config: AutoAnalysisConfig) => {
    if (isAnalyzing) {
      stopAutoAnalysis();
    }

    const validationResult = validateAnalysisConfig(config, user);
    if (!validationResult.isValid) {
      return;
    }

    setIsAnalyzing(true);
    abortControllerRef.current = new AbortController();
    
    try {
      await performAnalysisCycle(config, user);
    } catch (error) {
      console.error("Error in analysis cycle:", error);
      stopAutoAnalysis();
    }
  };

  return {
    startAutoAnalysis,
    stopAutoAnalysis,
    isAnalyzing
  };
};
