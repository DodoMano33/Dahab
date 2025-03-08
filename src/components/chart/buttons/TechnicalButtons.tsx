
import { PatternButton } from "./PatternButton";
import { FibonacciButtonGroup } from "./groups/FibonacciButtonGroup";
import { BasicButtonGroup } from "./groups/BasicButtonGroup";
import { AdvancedAnalysisGroup } from "./groups/AdvancedAnalysisGroup";
import { WavesAndPriceActionGroup } from "./groups/WavesAndPriceActionGroup";

interface TechnicalButtonsProps {
  isAnalyzing: boolean;
  onNormalClick: (e: React.MouseEvent) => void;
  onScalpingClick: (e: React.MouseEvent) => void;
  onAIClick: (e: React.MouseEvent) => void;
  onSMCClick: (e: React.MouseEvent) => void;
  onICTClick: (e: React.MouseEvent) => void;
  onTurtleSoupClick: (e: React.MouseEvent) => void;
  onGannClick: (e: React.MouseEvent) => void;
  onWavesClick: (e: React.MouseEvent) => void;
  onPriceActionClick: (e: React.MouseEvent) => void;
  onPatternClick: (e: React.MouseEvent) => void;
  onFibonacciClick: (e: React.MouseEvent) => void;
  onFibonacciAdvancedClick: (e: React.MouseEvent) => void;
}

export const TechnicalButtons = ({
  isAnalyzing,
  onNormalClick,
  onScalpingClick,
  onAIClick,
  onSMCClick,
  onICTClick,
  onTurtleSoupClick,
  onGannClick,
  onWavesClick,
  onPriceActionClick,
  onPatternClick,
  onFibonacciClick,
  onFibonacciAdvancedClick
}: TechnicalButtonsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {/* الصف الأول: الأساسية والمتقدمة */}
      <div className="space-y-4">
        <BasicButtonGroup
          isAnalyzing={isAnalyzing}
          onNormalClick={onNormalClick}
          onScalpingClick={onScalpingClick}
          onAIClick={onAIClick}
        />
      </div>
      
      <div className="space-y-4">
        <AdvancedAnalysisGroup
          isAnalyzing={isAnalyzing}
          onSMCClick={onSMCClick}
          onICTClick={onICTClick}
          onTurtleSoupClick={onTurtleSoupClick}
          onGannClick={onGannClick}
        />
      </div>
      
      {/* الصف الثاني: الموجات والفيبوناتشي */}
      <div className="space-y-4">
        <WavesAndPriceActionGroup
          isAnalyzing={isAnalyzing}
          onWavesClick={onWavesClick}
          onPriceActionClick={onPriceActionClick}
        />
      </div>
      
      <div className="space-y-4">
        <FibonacciButtonGroup
          isAnalyzing={isAnalyzing}
          onFibonacciClick={onFibonacciClick}
          onFibonacciAdvancedClick={onFibonacciAdvancedClick}
        />
      </div>
      
      {/* الصف الثالث: زر الأنماط يمتد على عمودين */}
      <div className="lg:col-span-2">
        <PatternButton isAnalyzing={isAnalyzing} onClick={onPatternClick} />
      </div>
    </div>
  );
};
