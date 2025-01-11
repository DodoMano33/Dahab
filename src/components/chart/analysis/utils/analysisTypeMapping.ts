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

export const mapAnalysisTypeToConfig = (analysisType: string): AnalysisConfig => {
  const typeMapping: Record<string, AnalysisConfig> = {
    'scalping': { ...defaultConfig, isScalping: true },
    'smc': { ...defaultConfig, isSMC: true },
    'ict': { ...defaultConfig, isICT: true },
    'turtle_soup': { ...defaultConfig, isTurtleSoup: true },
    'gann': { ...defaultConfig, isGann: true },
    'waves': { ...defaultConfig, isWaves: true },
    'patterns': { ...defaultConfig, isPatternAnalysis: true },
    'price_action': { ...defaultConfig, isPriceAction: true }
  };

  return typeMapping[analysisType] || { ...defaultConfig };
};

export const mapToAnalysisType = (analysisType: string): AnalysisType => {
  const mapping: Record<string, AnalysisType> = {
    'scalping': 'سكالبينج',
    'price_action': 'Price Action',
    'turtle_soup': 'Turtle Soup',
    'smc': 'SMC',
    'ict': 'ICT',
    'gann': 'Gann',
    'waves': 'Waves',
    'patterns': 'Patterns'
  };
  
  return mapping[analysisType] || 'Patterns';
};