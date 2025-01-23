import { AnalysisForm } from "../AnalysisForm";
import { AnalysisSettings } from "../AnalysisSettings";
import { AnalysisContainer } from "./AnalysisContainer";

interface AnalysisManagerProps {
  isAnalyzing: boolean;
  currentAnalysis: string;
  autoSymbol: string;
  autoPrice: number | null;
  analysisDuration: string;
  onAnalysis: (newItem: any) => void;
  onAnalysisComplete: (newItem: any) => void;
  onDurationChange: (duration: string) => void;
  image: string | null;
  analysis: any;
  onClose: () => void;
  symbol: string;
}

export const AnalysisManager = ({
  isAnalyzing,
  currentAnalysis,
  autoSymbol,
  autoPrice,
  analysisDuration,
  onAnalysis,
  onAnalysisComplete,
  onDurationChange,
  image,
  analysis,
  onClose,
  symbol,
}: AnalysisManagerProps) => {
  return (
    <div className="space-y-6">
      <AnalysisForm
        onAnalysis={onAnalysis}
        isAnalyzing={isAnalyzing}
        currentAnalysis={currentAnalysis || ""}
        defaultSymbol={autoSymbol}
        defaultPrice={autoPrice}
        defaultDuration={analysisDuration}
        onDurationChange={onDurationChange}
      />

      <AnalysisSettings
        onAnalysisComplete={onAnalysisComplete}
        defaultSymbol={autoSymbol}
        defaultPrice={autoPrice}
        defaultDuration={analysisDuration}
      />
      
      <AnalysisContainer
        image={image}
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        onClose={onClose}
        symbol={symbol}
        currentAnalysis={currentAnalysis}
      />
    </div>
  );
};