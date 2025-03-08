
import { AnalysisType } from "@/types/analysis";

export const mapToAnalysisType = (analysisType: string): AnalysisType => {
  // Normalize the string for comparison (lowercase, remove spaces/special chars)
  const normalizedType = analysisType.toLowerCase().replace(/[\s-_]/g, '');
  
  console.log("Mapping analysis type:", analysisType, "Normalized:", normalizedType);
  
  // Map the analysis type to a valid database value
  switch (normalizedType) {
    case 'نمطي':
    case 'pattern':
    case 'patterns':
      return 'نمطي';
      
    case 'سكالبينج':
    case 'مضاربة':
    case 'scalping':
      return 'مضاربة';
      
    case 'smc':
    case 'نظريةهيكلالسوق':
      return 'نظرية هيكل السوق';
      
    case 'ict':
    case 'نظريةالسوق':
      return 'نظرية السوق';
      
    case 'تقلبات':
    case 'wave':
    case 'waves':
      return 'تقلبات';
      
    case 'حركةالسعر':
    case 'priceaction':
      return 'حركة السعر';
      
    case 'جان':
    case 'gann':
      return 'جان';
      
    case 'الحساءالسلحفائي':
    case 'turtlesoup':
    case 'turtle':
      return 'الحساء السلحفائي';
      
    case 'ذكي':
    case 'smart':
    case 'ai':
      return 'ذكي';
      
    case 'شبكاتعصبية':
    case 'neuralnetworks':
    case 'neuralnetwork':
      return 'شبكات عصبية';
      
    case 'فيبوناتشي':
    case 'فيبوناتشيمتقدم':
    case 'fibonacci':
    case 'fibonacci_advanced':
    case 'fibonacciadvanced':
      return 'فيبوناتشي';
      
    default:
      console.log("Unknown analysis type:", analysisType, "Using default: يومي");
      return 'يومي';
  }
};
