
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
  isNeuralNetwork: boolean;
  isRNN: boolean;
  isTimeClustering: boolean;
  isMultiVariance: boolean;
  isCompositeCandlestick: boolean;
  isBehavioral: boolean;
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
    isPriceAction: false,
    isNeuralNetwork: false,
    isRNN: false,
    isTimeClustering: false,
    isMultiVariance: false,
    isCompositeCandlestick: false,
    isBehavioral: false
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
    case 'neural_networks':
      return { ...defaultConfig, isNeuralNetwork: true };
    case 'rnn':
      return { ...defaultConfig, isRNN: true };
    case 'time_clustering':
      return { ...defaultConfig, isTimeClustering: true };
    case 'multi_variance':
      return { ...defaultConfig, isMultiVariance: true };
    case 'composite_candlestick':
      return { ...defaultConfig, isCompositeCandlestick: true };
    case 'behavioral':
      return { ...defaultConfig, isBehavioral: true };
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
    case 'neural_networks':
      return "شبكات عصبية";
    case 'rnn':
      return "شبكات عصبية متكررة";
    case 'time_clustering':
      return "تصفيق زمني";
    case 'multi_variance':
      return "تباين متعدد العوامل";
    case 'composite_candlestick':
      return "شمعات مركبة";
    case 'behavioral':
      return "تحليل سلوكي";
    case 'normal':
      return "عادي"; 
    default:
      return "عادي";
  }
};
