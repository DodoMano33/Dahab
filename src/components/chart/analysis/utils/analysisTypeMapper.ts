import { AnalysisData } from "@/types/analysis";

const VALID_ANALYSIS_TYPES = [
  'سكالبينج',
  'SMC',
  'ICT',
  'Turtle Soup',
  'Gann',
  'Waves',
  'Patterns',
  'Price Action'
] as const;

export const mapAnalysisType = (type: string): AnalysisData['analysisType'] => {
  // تحويل النوع إلى حروف صغيرة للمقارنة
  const normalizedType = type.toLowerCase();
  
  // تعيين القيم المقابلة
  const typeMapping: Record<string, AnalysisData['analysisType']> = {
    'scalping': 'سكالبينج',
    'smc': 'SMC',
    'ict': 'ICT',
    'turtlesoup': 'Turtle Soup',
    'gann': 'Gann',
    'waves': 'Waves',
    'patterns': 'Patterns',
    'priceaction': 'Price Action'
  };

  const mappedType = typeMapping[normalizedType];
  
  if (!mappedType) {
    console.error(`نوع تحليل غير معروف: ${type}`);
    throw new Error(`نوع تحليل غير معروف: ${type}`);
  }

  return mappedType;
};

export const isValidAnalysisType = (type: string): boolean => {
  return VALID_ANALYSIS_TYPES.includes(type as any);
};