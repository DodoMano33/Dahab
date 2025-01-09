import { AnalysisData } from "@/types/analysis";

export const mapAnalysisType = (type: string): AnalysisData['analysisType'] => {
  const mapping: { [key: string]: AnalysisData['analysisType'] } = {
    'scalping': 'سكالبينج',
    'smc': 'SMC',
    'ict': 'ICT',
    'turtleSoup': 'Turtle Soup',
    'gann': 'Gann',
    'waves': 'Waves',
    'patterns': 'Patterns',
    'priceAction': 'Price Action'
  };
  
  const mappedType = mapping[type];
  if (!mappedType) {
    console.warn(`نوع تحليل غير معروف: ${type}`);
    return 'Patterns'; // نوع افتراضي
  }
  
  return mappedType;
};