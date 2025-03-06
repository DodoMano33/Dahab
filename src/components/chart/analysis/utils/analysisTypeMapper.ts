
import { AnalysisType } from "@/types/analysis";

/**
 * Maps UI analysis type names to database enum values
 */
export const mapToAnalysisType = (analysisType: string): AnalysisType => {
  console.log("Mapping analysis type:", analysisType);
  
  // Normalize the analysis type (remove special characters, spaces, make lowercase)
  const normalizedType = analysisType.toLowerCase()
    .replace(/[\s_\-]/g, '')
    .trim();
  
  console.log("Normalized analysis type:", normalizedType);
  
  // Map normalized types to database enum values
  switch (normalizedType) {
    case "عادي":
    case "normal":
    case "تحليلعادي":
    case "التحليلالعادي":
      return "normal";
      
    case "fibonacci":
    case "فيبوناتشي":
      return "fibonacci";
      
    case "fibonacci_advanced":
    case "fibonacciadvanced":
    case "فيبوناتشيمتقدم":
    case "تحليلفيبوناتشيمتقدم":
      return "fibonacci_advanced";
      
    case "gann":
    case "جان":
    case "تحليلجان":
      return "gann";
      
    case "waves":
    case "موجات":
    case "تحليلالموجات":
      return "waves";
      
    case "priceaction":
    case "حركةالسعر":
      return "price_action";
      
    case "scalping":
    case "سكالبينج":
    case "مضاربة":
      return "scalping";
      
    case "smc":
    case "تحليلتحكمالسيولة":
      return "smc";
      
    case "ict":
    case "تحليلict":
      return "ict";
      
    case "timeclustering":
    case "تحليلتجمعالوقت":
      return "time_clustering";
      
    case "pattern":
    case "نمطي":
    case "تحليلالأنماط":
      return "pattern";
      
    case "multivariance":
    case "التباينالمتعدد":
      return "multi_variance";
      
    case "neuralnetwork":
    case "الشبكةالعصبية":
      return "neural_network";
      
    case "behaviors":
    case "تحليلالسلوك":
      return "behaviors";
      
    case "turtlesoup":
    case "تحليلturtlesoup":
      return "turtle_soup";
      
    case "rnn":
    case "شبكةrnnالعصبية":
      return "rnn";
      
    case "compositecandlesticks":
    case "تحليلالشموعالمركب":
      return "composite_candlesticks";
      
    default:
      console.warn(`Unknown analysis type: ${analysisType}, defaulting to "normal"`);
      return "normal";
  }
};
