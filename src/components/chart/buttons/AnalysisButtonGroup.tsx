
import { useState } from "react";
import { CombinedAnalysisDialog } from "../analysis/CombinedAnalysisDialog";
import { BasicButtonGroup } from "./groups/BasicButtonGroup";
import { WavesAndPriceActionGroup } from "./groups/WavesAndPriceActionGroup";
import { FibonacciButtonGroup } from "./groups/FibonacciButtonGroup";
import { AdvancedAnalysisGroup } from "./groups/AdvancedAnalysisGroup";
import { TechnicalButtons } from "./TechnicalButtons";

interface AnalysisButtonGroupProps {
  isAnalyzing: boolean;
  onSubmit: (
    e: React.MouseEvent,
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
    selectedTypes?: string[]
  ) => void;
  onHistoryClick: () => void;
  currentAnalysis?: string;
}

export const AnalysisButtonGroup = ({
  isAnalyzing,
  onSubmit,
  onHistoryClick,
  currentAnalysis
}: AnalysisButtonGroupProps) => {
  const [isCombinedAnalysisOpen, setIsCombinedAnalysisOpen] = useState(false);

  const handleSmartAnalysisClick = (e: React.MouseEvent) => {
    setIsCombinedAnalysisOpen(true);
  };

  const handleCombinedAnalysis = (selectedTypes: string[]) => {
    // Create a synthetic mouse event to pass to onSubmit
    const syntheticEvent = {
      preventDefault: () => {},
      stopPropagation: () => {}
    } as React.MouseEvent;
    
    // Pass selectedTypes to onSubmit
    onSubmit(
      syntheticEvent, 
      false, // isScalping
      true,  // isAI
      false, // isSMC
      false, // isICT
      false, // isTurtleSoup
      false, // isGann
      false, // isWaves
      false, // isPatternAnalysis
      false, // isPriceAction
      false, // isNeuralNetwork
      false, // isRNN
      false, // isTimeClustering
      false, // isMultiVariance
      false, // isCompositeCandlestick
      false, // isBehavioral
      false, // isFibonacci
      false, // isFibonacciAdvanced
      selectedTypes
    );
  };

  return (
    <div className="space-y-4">
      {/* Basic Analysis Group */}
      <BasicButtonGroup 
        isAnalyzing={isAnalyzing}
        onPatternClick={(e) => onSubmit(e, false, false, false, false, false, false, false, true)}
        onScalpingClick={(e) => onSubmit(e, true)}
        onSmartAnalysisClick={handleSmartAnalysisClick}
        currentAnalysis={currentAnalysis}
      />

      {/* Technical Analysis Buttons */}
      <TechnicalButtons
        isAnalyzing={isAnalyzing}
        onSMCClick={(e) => onSubmit(e, false, false, true)}
        onICTClick={(e) => onSubmit(e, false, false, false, true)}
        onTurtleSoupClick={(e) => onSubmit(e, false, false, false, false, true)}
        onGannClick={(e) => onSubmit(e, false, false, false, false, false, true)}
      />
      
      {/* Waves and Price Action Group */}
      <WavesAndPriceActionGroup 
        isAnalyzing={isAnalyzing}
        onWavesClick={(e) => onSubmit(e, false, false, false, false, false, false, true)}
        onPriceActionClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, true)}
      />

      {/* Fibonacci Analysis Buttons */}
      <FibonacciButtonGroup 
        isAnalyzing={isAnalyzing}
        onFibonacciClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true)}
        onFibonacciAdvancedClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true)}
      />

      {/* Advanced Analysis Buttons */}
      <AdvancedAnalysisGroup 
        isAnalyzing={isAnalyzing}
        onNeuralNetworkClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, true)}
        onRNNClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, true)}
        onTimeClusteringClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, true)}
        onMultiVarianceClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, false, true)}
        onCompositeCandlestickClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, false, false, true)}
        onBehavioralClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true)}
      />

      {/* Combined Analysis Dialog */}
      <CombinedAnalysisDialog 
        isOpen={isCombinedAnalysisOpen}
        onClose={() => setIsCombinedAnalysisOpen(false)}
        onAnalyze={handleCombinedAnalysis}
      />
    </div>
  );
};
