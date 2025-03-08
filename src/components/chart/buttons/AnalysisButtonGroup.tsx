
import { useState } from "react";
import { TechnicalButtons } from "./TechnicalButtons";
import { CombinedAnalysisDialog } from "../analysis/CombinedAnalysisDialog";
import { BasicButtonGroup } from "./groups/BasicButtonGroup";
import { WavesAndPriceActionGroup } from "./groups/WavesAndPriceActionGroup";
import { FibonacciButtonGroup } from "./groups/FibonacciButtonGroup";
import { AdvancedAnalysisGroup } from "./groups/AdvancedAnalysisGroup";
import { PatternButton } from "./PatternButton";

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
      {/* Smart Analysis Button - Full width */}
      <BasicButtonGroup 
        isAnalyzing={isAnalyzing}
        onNormalClick={(e) => onSubmit(e)}
        onScalpingClick={(e) => onSubmit(e, true)}
        onAIClick={(e) => onSubmit(e, false, true)}
        onSmartAnalysisClick={handleSmartAnalysisClick}
        currentAnalysis={currentAnalysis}
      />

      {/* Technical Analysis Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <AdvancedAnalysisGroup
            isAnalyzing={isAnalyzing}
            onSMCClick={(e) => onSubmit(e, false, false, true)}
            onICTClick={(e) => onSubmit(e, false, false, false, true)}
            onTurtleSoupClick={(e) => onSubmit(e, false, false, false, false, true)}
            onGannClick={(e) => onSubmit(e, false, false, false, false, false, true)}
            onNeuralNetworkClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, true)}
            onRNNClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, true)}
            onTimeClusteringClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, true)}
            onMultiVarianceClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, false, true)}
            onCompositeCandlestickClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, false, false, true)}
            onBehavioralClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true)}
          />
        </div>
        
        <div>
          <WavesAndPriceActionGroup 
            isAnalyzing={isAnalyzing}
            onWavesClick={(e) => onSubmit(e, false, false, false, false, false, false, true)}
            onPriceActionClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, true)}
          />
        </div>
      </div>

      {/* Fibonacci Analysis Buttons */}
      <div className="mb-4">
        <FibonacciButtonGroup 
          isAnalyzing={isAnalyzing}
          onFibonacciClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true)}
          onFibonacciAdvancedClick={(e) => onSubmit(e, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true)}
        />
      </div>

      {/* Pattern Analysis Button */}
      <div>
        <PatternButton 
          isAnalyzing={isAnalyzing} 
          onClick={(e) => onSubmit(e, false, false, false, false, false, false, false, true)}
        />
      </div>

      {/* Combined Analysis Dialog */}
      <CombinedAnalysisDialog 
        isOpen={isCombinedAnalysisOpen}
        onClose={() => setIsCombinedAnalysisOpen(false)}
        onAnalyze={handleCombinedAnalysis}
      />
    </div>
  );
};
