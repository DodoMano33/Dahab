
/**
 * Machine Learning analysis executor
 */

import { AnalysisData } from "@/types/analysis";
import { analyzeNeuralNetworkChart } from "@/components/chart/analysis/neuralNetworkAnalysis";
import { analyzeRNN } from "@/components/chart/analysis/rnnAnalysis";

export const executeMachineLearningAnalysis = async (
  type: string,
  chartImage: string,
  currentPrice: number,
  timeframe: string
): Promise<AnalysisData> => {
  console.log(`Executing machine learning analysis for type: ${type}`);
  
  switch (type) {
    case "neuralnetworks":
    case "شبكاتعصبية":
      console.log("Executing Neural Networks analysis");
      return await analyzeNeuralNetworkChart(chartImage, currentPrice, timeframe);
      
    case "rnn":
    case "شبكاتعصبيةمتكررة":
      console.log("Executing RNN analysis");
      return await analyzeRNN(chartImage, currentPrice, timeframe);
      
    default:
      console.log(`Unknown machine learning analysis type "${type}", defaulting to Neural Networks analysis`);
      return await analyzeNeuralNetworkChart(chartImage, currentPrice, timeframe);
  }
};
