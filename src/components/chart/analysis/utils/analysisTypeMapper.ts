import { AnalysisType } from "@/types/analysis";

interface AnalysisConfig {
  isScalping: boolean;
  isSMC: boolean;
  isICT: boolean;
  isTurtleSoup: boolean;
  isGann: boolean;
  isWaves: boolean;
  isPatternAnalysis: boolean;
  isPriceAction: boolean;
}

export const mapAnalysisTypeToConfig = (type: string): AnalysisConfig => {
  const defaultConfig: AnalysisConfig = {
    isScalping: false,
    isSMC: false,
    isICT: false,
    isTurtleSoup: false,
    isGann: false,
    isWaves: false,
    isPatternAnalysis: false,
    isPriceAction: false
  };

  switch (type.toLowerCase()) {
    case 'scalping':
      return { ...defaultConfig, isScalping: true };
    case 'smc':
      return { ...defaultConfig, isSMC: true };
    case 'ict':
      return { ...defaultConfig, isICT: true };
    case 'turtle_soup':
      return { ...defaultConfig, isTurtleSoup: true };
    case 'gann':
      return { ...defaultConfig, isGann: true };
    case 'waves':
      return { ...defaultConfig, isWaves: true };
    case 'patterns':
      return { ...defaultConfig, isPatternAnalysis: true };
    case 'price_action':
      return { ...defaultConfig, isPriceAction: true };
    default:
      return defaultConfig;
  }
};

export const mapToAnalysisType = (type: string): AnalysisType => {
  switch (type.toLowerCase()) {
    case 'scalping':
      return "سكالبينج";
    case 'smart':
      return "ذكي";
    case 'smc':
      return "SMC";
    case 'ict':
      return "ICT";
    case 'turtle_soup':
      return "Turtle Soup";
    case 'gann':
      return "Gann";
    case 'waves':
      return "Waves";
    case 'patterns':
      return "Patterns";
    case 'price_action':
      return "Price Action";
    default:
      return "عادي";
  }
};