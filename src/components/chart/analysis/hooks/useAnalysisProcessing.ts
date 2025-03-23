
import { useState } from "react";
import { AnalysisData } from "@/types/analysis";
import { processChartAnalysis } from "../utils/chartAnalysisProcessor";
import { showErrorToast } from "../utils/toastUtils";
import { AnalysisInput } from "../utils/processors/inputValidator";

export const useAnalysisProcessing = (
  setIsAnalyzing: (isAnalyzing: boolean) => void,
  setAnalysis: (analysis: AnalysisData | null) => void
) => {
  const processAnalysis = async (input: AnalysisInput) => {
    try {
      console.log("Processing analysis with input:", input);
      
      const result = await processChartAnalysis(input);
      
      // Store the analysis result
      if (result && result.analysisResult) {
        setAnalysis(result.analysisResult);
      }
      
      return result;
    } catch (error) {
      console.error("Error processing analysis:", error);
      showErrorToast(error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { processAnalysis };
};
