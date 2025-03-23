
import { ChartInput } from "../ChartInput";
import { useAnalysisSubmit } from "./hooks/useAnalysisSubmit";
import { SearchHistoryItem } from "@/types/analysis";
import { useState } from "react";

interface AnalysisFormProps {
  onAnalysis: (item: SearchHistoryItem) => void;
  isAnalyzing: boolean;
  currentAnalysis?: string;
  onHistoryClick?: () => void;
  defaultSymbol?: string;
  defaultPrice?: number | null;
}

export const AnalysisForm = ({ 
  onAnalysis, 
  isAnalyzing, 
  currentAnalysis,
  onHistoryClick,
  defaultSymbol,
  defaultPrice
}: AnalysisFormProps) => {
  const symbol = defaultSymbol || "XAUUSD";
  const { onSubmit } = useAnalysisSubmit({ symbol });

  const handleAnalysis = (
    symbol: string, 
    timeframe: string, 
    providedPrice?: number,
    isScalping?: boolean,
    isAI?: boolean,
    isSMC?: boolean,
    isICT?: boolean,
    isTurtleSoup?: boolean,
    isGann?: boolean,
    isWaves?: boolean,
    isPatternAnalysis?: boolean,
    isPriceAction?: boolean,
    isNeuralNetwork?: boolean,
    isRNN?: boolean,
    isTimeClustering?: boolean,
    isMultiVariance?: boolean,
    isCompositeCandlestick?: boolean,
    isBehavioral?: boolean,
    isFibonacci?: boolean,
    isFibonacciAdvanced?: boolean,
    duration?: string
  ) => {
    // Determine the analysis type based on the boolean flags
    const analysisType = determineAnalysisType(
      isScalping, isAI, isSMC, isICT, isTurtleSoup, isGann, isWaves, 
      isPatternAnalysis, isPriceAction, isNeuralNetwork, isRNN, 
      isTimeClustering, isMultiVariance, isCompositeCandlestick, 
      isBehavioral, isFibonacci, isFibonacciAdvanced
    );
    
    // Create an array of selected types
    const selectedTypes = createSelectedTypesArray(
      isScalping, isAI, isSMC, isICT, isTurtleSoup, isGann, isWaves, 
      isPatternAnalysis, isPriceAction, isNeuralNetwork, isRNN, 
      isTimeClustering, isMultiVariance, isCompositeCandlestick, 
      isBehavioral, isFibonacci, isFibonacciAdvanced
    );
    
    // Make sure there is at least one selected type
    if (selectedTypes.length === 0 && !analysisType) {
      console.error("No analysis type selected");
      return;
    }
    
    // Call the onSubmit function with the appropriate parameters
    onSubmit(
      timeframe, 
      analysisType || "عادي", 
      selectedTypes,
      providedPrice,
      isAI,
      isSMC,
      isICT,
      isTurtleSoup,
      isGann,
      isWaves,
      isPatternAnalysis,
      isPriceAction,
      isNeuralNetwork,
      isRNN,
      isTimeClustering,
      isMultiVariance,
      isCompositeCandlestick,
      isBehavioral,
      isFibonacci,
      isFibonacciAdvanced,
      duration
    );
  };

  return (
    <ChartInput
      mode="tradingview"
      onTradingViewConfig={(
        symbol: string, 
        timeframe: string, 
        providedPrice?: number,
        isScalping?: boolean,
        isAI?: boolean,
        isSMC?: boolean,
        isICT?: boolean,
        isTurtleSoup?: boolean,
        isGann?: boolean,
        isWaves?: boolean,
        isPatternAnalysis?: boolean,
        isPriceAction?: boolean,
        isNeuralNetwork?: boolean,
        isRNN?: boolean,
        isTimeClustering?: boolean,
        isMultiVariance?: boolean,
        isCompositeCandlestick?: boolean,
        isBehavioral?: boolean,
        isFibonacci?: boolean,
        isFibonacciAdvanced?: boolean,
        duration?: string
      ) => {
        return handleAnalysis(
          symbol, 
          timeframe, 
          providedPrice, 
          isScalping, 
          isAI, 
          isSMC, 
          isICT, 
          isTurtleSoup, 
          isGann, 
          isWaves, 
          isPatternAnalysis, 
          isPriceAction, 
          isNeuralNetwork,
          isRNN, 
          isTimeClustering, 
          isMultiVariance, 
          isCompositeCandlestick, 
          isBehavioral,
          isFibonacci,
          isFibonacciAdvanced,
          duration
        );
      }}
      onHistoryClick={onHistoryClick}
      isAnalyzing={isAnalyzing}
    />
  );
};

// Helper function to determine the analysis type
function determineAnalysisType(
  isScalping?: boolean,
  isAI?: boolean,
  isSMC?: boolean,
  isICT?: boolean,
  isTurtleSoup?: boolean,
  isGann?: boolean,
  isWaves?: boolean,
  isPatternAnalysis?: boolean,
  isPriceAction?: boolean,
  isNeuralNetwork?: boolean,
  isRNN?: boolean,
  isTimeClustering?: boolean,
  isMultiVariance?: boolean,
  isCompositeCandlestick?: boolean,
  isBehavioral?: boolean,
  isFibonacci?: boolean,
  isFibonacciAdvanced?: boolean
) {
  if (isScalping) return "سكالبينج";
  if (isAI) return "ذكي";
  if (isSMC) return "SMC";
  if (isICT) return "ICT";
  if (isTurtleSoup) return "Turtle Soup";
  if (isGann) return "Gann";
  if (isWaves) return "Waves";
  if (isPatternAnalysis) return "Patterns";
  if (isPriceAction) return "Price Action";
  if (isNeuralNetwork) return "شبكات عصبية";
  if (isRNN) return "شبكات عصبية متكررة";
  if (isTimeClustering) return "تصفيق زمني";
  if (isMultiVariance) return "تباين متعدد العوامل";
  if (isCompositeCandlestick) return "شمعات مركبة";
  if (isBehavioral) return "تحليل سلوكي";
  if (isFibonacci) return "فيبوناتشي";
  if (isFibonacciAdvanced) return "فيبوناتشي متقدم";
  return "عادي";
}

// Helper function to create an array of selected types
function createSelectedTypesArray(
  isScalping?: boolean,
  isAI?: boolean,
  isSMC?: boolean,
  isICT?: boolean,
  isTurtleSoup?: boolean,
  isGann?: boolean,
  isWaves?: boolean,
  isPatternAnalysis?: boolean,
  isPriceAction?: boolean,
  isNeuralNetwork?: boolean,
  isRNN?: boolean,
  isTimeClustering?: boolean,
  isMultiVariance?: boolean,
  isCompositeCandlestick?: boolean,
  isBehavioral?: boolean,
  isFibonacci?: boolean,
  isFibonacciAdvanced?: boolean
) {
  const types = [];
  if (isScalping) types.push("سكالبينج");
  if (isAI) types.push("ذكي");
  if (isSMC) types.push("SMC");
  if (isICT) types.push("ICT");
  if (isTurtleSoup) types.push("Turtle Soup");
  if (isGann) types.push("Gann");
  if (isWaves) types.push("Waves");
  if (isPatternAnalysis) types.push("Patterns");
  if (isPriceAction) types.push("Price Action");
  if (isNeuralNetwork) types.push("شبكات عصبية");
  if (isRNN) types.push("شبكات عصبية متكررة");
  if (isTimeClustering) types.push("تصفيق زمني");
  if (isMultiVariance) types.push("تباين متعدد العوامل");
  if (isCompositeCandlestick) types.push("شمعات مركبة");
  if (isBehavioral) types.push("تحليل سلوكي");
  if (isFibonacci) types.push("فيبوناتشي");
  if (isFibonacciAdvanced) types.push("فيبوناتشي متقدم");
  return types;
}
