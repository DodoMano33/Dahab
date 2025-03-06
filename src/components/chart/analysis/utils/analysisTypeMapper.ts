
import { AnalysisType } from "@/types/analysis";

// Map the display names to valid database enum values
export const mapToAnalysisType = (type: string): AnalysisType => {
  // Normalize the input by removing spaces, underscores, and converting to lowercase
  const normalizedType = type.toLowerCase().replace(/[_\s]/g, "");
  
  console.log("Mapping analysis type:", type, "normalized to:", normalizedType);
  
  // Map to database enum values
  switch (normalizedType) {
    case "normal":
    case "نمطي":
    case "pattern":
    case "patterns":
      return "نمطي";
    
    case "waves":
    case "تقلبات":
    case "موجات":
      return "تقلبات";
    
    case "gann":
    case "جان":
      return "جان";
    
    case "turtlesoup":
    case "الحساءالسلحفائي":
      return "الحساء السلحفائي";
    
    case "ict":
    case "نظريةالسوق":
      return "نظرية السوق";
    
    case "smc":
    case "نظريةهيكلالسوق":
      return "نظرية هيكل السوق";
    
    case "scalping":
    case "سكالبينج":
    case "مضاربة":
      return "مضاربة";
    
    case "priceaction":
    case "حركةالسعر":
      return "حركة السعر";
    
    case "fibonacci":
    case "fib":
    case "فيبوناتشي":
    case "fibonacci_advanced":
    case "advancedfibonacci":
    case "fibonacciadvanced":
    case "تحليلفيبوناتشيمتقدم":
      // Always map both regular and advanced fibonacci to "نمطي" for database compatibility
      return "نمطي";
    
    case "neuralnetwork":
    case "شبكاتعصبية":
    case "neural":
    case "nn":
      return "شبكات عصبية";
    
    case "rnn":
    case "شبكاتعصبيةمتكررة":
      return "شبكات عصبية";
    
    case "timeclustering":
    case "تصفيقزمني":
      return "تقلبات";
    
    case "multivariance":
    case "تباينمتعدد":
      return "تقلبات";
    
    case "compositecandlestick":
    case "شمعاتمركبة":
      return "نمطي";
    
    case "behavioral":
    case "تحليلسلوكي":
      return "حركة السعر";
    
    case "smart":
    case "ذكي":
    case "ai":
      return "ذكي";
    
    default:
      console.warn("Unknown analysis type:", type, "defaulting to نمطي");
      return "نمطي"; // Default to pattern analysis
  }
};
