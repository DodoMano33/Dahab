
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
    toast.info("Analyzing data using Pattern Analysis...", { id: toastId, duration: Infinity });
  } else if (isWaves) {
    toast.info("Analyzing data using Waves model...", { id: toastId, duration: Infinity });
  } else if (isGann) {
    toast.info("Analyzing data using Gann theory...", { id: toastId, duration: Infinity });
  } else if (isTurtleSoup) {
    toast.info("Analyzing data using Turtle Soup model...", { id: toastId, duration: Infinity });
  } else if (isICT) {
    toast.info("Analyzing data using ICT model...", { id: toastId, duration: Infinity });
  } else if (isSMC) {
    toast.info("Analyzing data using SMC model...", { id: toastId, duration: Infinity });
  } else if (isNeuralNetwork) {
    toast.info("Analyzing data using Neural Networks...", { id: toastId, duration: Infinity });
  } else if (isAI) {
    toast.info("Analyzing data using Artificial Intelligence...", { id: toastId, duration: Infinity });
  }
  
  // Return the toast ID so it can be dismissed later if needed
  return toastId;
};
