
import { AnalysisData } from "@/types/analysis"; 
import { supabase } from "@/lib/supabase";

// This is a mock function to process chart analysis based on input
export const processChartAnalysis = async (input: any) => {
  console.log("Processing chart analysis with input:", input);

  try {
    // Construct analysis result
    const result = {
      analysisResult: {
        pattern: "Test Pattern",
        direction: "صاعد" as "صاعد" | "هابط" | "محايد",
        currentPrice: input.providedPrice || 0,
        support: (input.providedPrice || 0) * 0.95,
        resistance: (input.providedPrice || 0) * 1.05,
        stopLoss: (input.providedPrice || 0) * 0.97,
        targets: [
          { price: (input.providedPrice || 0) * 1.02, expectedTime: new Date() },
          { price: (input.providedPrice || 0) * 1.05, expectedTime: new Date() }
        ],
        bestEntryPoint: {
          price: (input.providedPrice || 0) * 0.99,
          reason: "مستوى دخول جيد"
        },
        analysisType: input.analysisType || "Unknown"
      },
      duration: input.duration || 8,
      symbol: input.symbol || "",
      currentPrice: input.providedPrice || 0
    };

    return result;
  } catch (error) {
    console.error("Error processing chart analysis:", error);
    throw error;
  }
};

// This function saves analysis to the database
export const saveAnalysisToDatabase = async (
  symbol: string,
  analysisType: string,
  currentPrice: number,
  analysis: AnalysisData,
  duration: number = 8
) => {
  try {
    console.log("Saving analysis to database:", {
      symbol,
      analysisType,
      currentPrice,
      analysis,
      duration
    });

    const { data, error } = await supabase.from("search_history").insert([
      {
        symbol,
        type: analysisType,
        price: currentPrice,
        analysis_data: analysis,
        duration_hours: duration,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      },
    ]);

    if (error) {
      console.error("Error saving analysis to database:", error);
      throw error;
    }

    console.log("Analysis saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in saveAnalysisToDatabase:", error);
    throw error;
  }
};
