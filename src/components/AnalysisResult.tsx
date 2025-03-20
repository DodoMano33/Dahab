
import { PatternCard } from "./analysis-result/PatternCard";
import { CurrentPriceCard } from "./analysis-result/CurrentPriceCard";
import { PriceLevelsGroup } from "./analysis-result/PriceLevelsGroup";
import { BestEntryPointCard } from "./analysis-result/BestEntryPointCard";
import { TargetsCard } from "./analysis-result/TargetsCard";
import { FibonacciLevelsCard } from "./analysis-result/FibonacciLevelsCard";
import { LoadingState } from "./analysis-result/LoadingState";

interface AnalysisResultProps {
  analysis: {
    pattern: string;
    direction: string;
    currentPrice: number;
    support: number;
    resistance: number;
    stopLoss: number;
    bestEntryPoint?: {
      price: number;
      reason: string;
    };
    targets?: {
      price: number;
      expectedTime: Date;
    }[];
    fibonacciLevels?: {
      level: number;
      price: number;
    }[];
  };
  isLoading: boolean;
}

export const AnalysisResult = ({ analysis, isLoading }: AnalysisResultProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <PatternCard pattern={analysis.pattern} direction={analysis.direction} />
        <CurrentPriceCard currentPrice={analysis.currentPrice} />
      </div>
      
      <PriceLevelsGroup 
        support={analysis.support}
        resistance={analysis.resistance}
        stopLoss={analysis.stopLoss}
        currentPrice={analysis.currentPrice}
      />
      
      {analysis.bestEntryPoint && (
        <BestEntryPointCard 
          price={analysis.bestEntryPoint.price}
          reason={analysis.bestEntryPoint.reason}
          currentPrice={analysis.currentPrice}
        />
      )}
      
      {analysis.targets && analysis.targets.length > 0 && (
        <TargetsCard 
          targets={analysis.targets} 
          currentPrice={analysis.currentPrice} 
        />
      )}

      {analysis.fibonacciLevels && analysis.fibonacciLevels.length > 0 && (
        <FibonacciLevelsCard 
          levels={analysis.fibonacciLevels} 
          currentPrice={analysis.currentPrice} 
        />
      )}
    </div>
  );
};
