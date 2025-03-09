
import { AnalysisType } from "@/types/analysis";

/**
 * Maps various analysis type input formats to the standardized AnalysisType enum
 * that's accepted by the database.
 */
export const mapToAnalysisType = (inputType: string): AnalysisType => {
  // Normalize the input by removing spaces and converting to lowercase
  const normalized = String(inputType).toLowerCase().replace(/\s+/g, '');
  console.log("Mapping analysis type:", inputType, "Normalized:", normalized);
  
  // Map normalized input to valid database values
  switch(normalized) {
    case 'فيبوناتشي':
    case 'fibonacci':
      return 'فيبوناتشي';
      
    case 'فيبوناتشيمتقدم':
    case 'advancedfibonacci':
    case 'fibonacci_advanced':
      return 'فيبوناتشي متقدم';
      
    case 'تحليلجان':
    case 'جان':
    case 'gann':
      return 'تحليل جان';
      
    case 'تحليلالموجات':
    case 'موجات':
    case 'waves':
      return 'تحليل الموجات';
      
    case 'حركةالسعر':
    case 'priceaction':
      return 'حركة السعر';
      
    case 'سكالبينج':
    case 'scalping':
      return 'سكالبينج';
      
    case 'smc':
    case 'تحليلsmc':
      return 'تحليل SMC';
      
    case 'ict':
    case 'تحليلict':
      return 'تحليل ICT';
      
    case 'تصفيقزمني':
    case 'timeclustering':
      return 'تصفيق زمني';
      
    case 'تحليلالأنماط':
    case 'تحليلالانماط':
    case 'patterns':
      return 'تحليل الأنماط';
      
    case 'تباينمتعدد':
    case 'multivariance':
      return 'تباين متعدد';
      
    case 'شبكاتعصبية':
    case 'neuralnetwork':
      return 'شبكات عصبية';
      
    case 'تحليلسلوكي':
    case 'behavioral':
    case 'سلوكي':
      return 'تحليل سلوكي';
      
    case 'turtlesoup':
    case 'حساءالسلحفاة':
      return 'Turtle Soup';
      
    case 'rnn':
    case 'شبكاتrnn':
    case 'شبكاتعصبيةمتكررة':
      return 'شبكات RNN';
      
    case 'شمعاتمركبة':
    case 'compositecandlestick':
      return 'شمعات مركبة';
      
    case 'ذكي':
    case 'smart':
      return 'ذكي';
      
    default:
      console.warn("Unrecognized analysis type:", inputType, "using default 'تحليل الأنماط'");
      return 'تحليل الأنماط';
  }
};
