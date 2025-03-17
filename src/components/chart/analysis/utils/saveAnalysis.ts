
import { supabase } from "@/lib/supabase";
import { AnalysisType, AnalysisData, SearchHistoryItem } from "@/types/analysis";
import { toast } from "sonner";

// دالة للحفظ إلى سجل التحليل
export const saveAnalysisToHistory = async ({
  symbol,
  timeframe,
  analysisResult,
  currentPrice,
  analysisType,
  duration = "8"
}: {
  symbol: string;
  timeframe: string;
  analysisResult: AnalysisData;
  currentPrice: number;
  analysisType: string;
  duration?: string;
}): Promise<SearchHistoryItem | null> => {
  try {
    console.log("Saving analysis to history:", {
      symbol,
      timeframe,
      analysisResult,
      currentPrice,
      analysisType,
      duration
    });

    const durationHours = Number(duration);

    // إنشاء كائن التحليل الذي سيتم حفظه
    const newItem: SearchHistoryItem = {
      id: Math.random().toString(36).substring(2, 15),
      date: new Date(),
      symbol,
      currentPrice,
      analysis: analysisResult,
      analysisType: analysisType as AnalysisType,
      timeframe,
      analysis_duration_hours: durationHours
    };

    console.log("Created new search history item:", newItem);
    
    return newItem;
  } catch (error) {
    console.error("Error saving analysis to history:", error);
    toast.error("حدث خطأ أثناء حفظ التحليل");
    return null;
  }
};

// Add the saveAnalysis function for compatibility with useSaveAnalysis.ts
export const saveAnalysis = async ({
  userId,
  symbol,
  currentPrice,
  analysisResult,
  analysisType,
  timeframe,
  durationHours
}: {
  userId: string;
  symbol: string;
  currentPrice: number;
  analysisResult: AnalysisData;
  analysisType: AnalysisType;
  timeframe: string;
  durationHours: number;
}) => {
  try {
    console.log("Saving analysis:", {
      userId,
      symbol,
      currentPrice,
      analysisResult,
      analysisType,
      timeframe,
      durationHours
    });
    
    // Creating a record with a generated ID
    const id = Math.random().toString(36).substring(2, 15);
    
    return {
      id,
      date: new Date(),
      userId,
      symbol,
      currentPrice,
      analysisType,
      timeframe,
      durationHours
    };
  } catch (error) {
    console.error("Error in saveAnalysis:", error);
    throw error;
  }
};
