
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
  if (isPatternAnalysis) {
    toast.info("جاري تحليل البيانات باستخدام تحليل الأنماط...");
  } else if (isWaves) {
    toast.info("جاري تحليل البيانات باستخدام نموذج Waves...");
  } else if (isGann) {
    toast.info("جاري تحليل البيانات باستخدام نظرية غان...");
  } else if (isTurtleSoup) {
    toast.info("جاري تحليل البيانات باستخدام نموذج Turtle Soup...");
  } else if (isICT) {
    toast.info("جاري تحليل البيانات باستخدام نموذج ICT...");
  } else if (isSMC) {
    toast.info("جاري تحليل البيانات باستخدام نموذج SMC...");
  } else if (isNeuralNetwork) {
    toast.info("جاري تحليل البيانات باستخدام الشبكات العصبية...");
  } else if (isAI) {
    toast.info("جاري تحليل البيانات باستخدام الذكاء الاصطناعي...");
  }
};
