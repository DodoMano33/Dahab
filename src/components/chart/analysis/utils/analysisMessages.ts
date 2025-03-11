
import { toast } from "sonner";

export const showAnalysisMessage = (
  isPatternAnalysis: boolean,
  isWaves: boolean,
  isGann: boolean,
  isTurtleSoup: boolean,
  isICT: boolean,
  isSMC: boolean,
  isAI: boolean,
  isNeuralNetwork: boolean = false
) => {
  // Create a unique toast ID that we can use to dismiss it later
  const toastId = "analysis-message-" + Date.now();
  
  if (isPatternAnalysis) {
    toast.info("جاري تحليل البيانات باستخدام تحليل الأنماط...", { id: toastId, duration: Infinity });
  } else if (isWaves) {
    toast.info("جاري تحليل البيانات باستخدام نموذج Waves...", { id: toastId, duration: Infinity });
  } else if (isGann) {
    toast.info("جاري تحليل البيانات باستخدام نظرية غان...", { id: toastId, duration: Infinity });
  } else if (isTurtleSoup) {
    toast.info("جاري تحليل البيانات باستخدام نموذج Turtle Soup...", { id: toastId, duration: Infinity });
  } else if (isICT) {
    toast.info("جاري تحليل البيانات باستخدام نموذج ICT...", { id: toastId, duration: Infinity });
  } else if (isSMC) {
    toast.info("جاري تحليل البيانات باستخدام نموذج SMC...", { id: toastId, duration: Infinity });
  } else if (isNeuralNetwork) {
    toast.info("جاري تحليل البيانات باستخدام الشبكات العصبية...", { id: toastId, duration: Infinity });
  } else if (isAI) {
    toast.info("جاري تحليل البيانات باستخدام الذكاء الاصطناعي...", { id: toastId, duration: Infinity });
  }
  
  // Return the toast ID so it can be dismissed later if needed
  return toastId;
};
