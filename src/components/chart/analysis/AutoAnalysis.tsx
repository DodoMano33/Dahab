import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalysisHandler } from "./AnalysisHandler";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { AutoAnalysisButton } from "./AutoAnalysisButton";

interface AutoAnalysisProps {
  symbol: string;
  price: string;
  selectedTimeframes: string[];
  selectedInterval: string;
  selectedAnalysisTypes: string[];
}

export const AutoAnalysis = ({
  symbol,
  price,
  selectedTimeframes,
  selectedInterval,
  selectedAnalysisTypes
}: AutoAnalysisProps) => {
  const { user } = useAuth();
  const { handleTradingViewConfig } = useAnalysisHandler();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisInterval, setAnalysisInterval] = useState<NodeJS.Timeout | null>(null);

  const validateInputs = () => {
    if (!symbol) {
      toast.error("الرجاء اختيار رمز العملة");
      return false;
    }

    if (!price) {
      toast.error("الرجاء إدخال السعر الحالي");
      return false;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("الرجاء إدخال سعر صحيح");
      return false;
    }

    if (selectedTimeframes.length === 0) {
      toast.error("الرجاء اختيار إطار زمني واحد على الأقل");
      return false;
    }

    if (!selectedInterval) {
      toast.error("الرجاء اختيار مدة التحليل");
      return false;
    }

    if (selectedAnalysisTypes.length === 0) {
      toast.error("الرجاء اختيار نوع تحليل واحد على الأقل");
      return false;
    }

    return true;
  };

  const startAnalysis = async () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول لبدء التحليل التلقائي");
      return;
    }

    if (!validateInputs()) {
      return;
    }

    setIsAnalyzing(true);
    console.log("بدء التحليل التلقائي:", {
      timeframes: selectedTimeframes,
      interval: selectedInterval,
      analysisTypes: selectedAnalysisTypes
    });

    const intervalMs = getIntervalInMs(selectedInterval);
    const numericPrice = Number(price);

    const runAnalysis = async () => {
      try {
        for (const timeframe of selectedTimeframes) {
          for (const analysisType of selectedAnalysisTypes) {
            const result = await handleTradingViewConfig(
              symbol,
              timeframe,
              numericPrice,
              analysisType === "scalping",
              false,
              analysisType === "smc",
              analysisType === "ict",
              analysisType === "turtleSoup",
              analysisType === "gann",
              analysisType === "waves",
              analysisType === "patterns",
              analysisType === "priceAction"
            );

            if (result && result.analysisResult) {
              await saveAnalysisToHistory(result, symbol, timeframe, analysisType, user.id);
            }
          }
        }
      } catch (error) {
        console.error("خطأ في التحليل التلقائي:", error);
        toast.error("حدث خطأ أثناء التحليل التلقائي");
      }
    };

    // Run initial analysis
    await runAnalysis();

    // Set up interval for repeated analysis
    const interval = setInterval(runAnalysis, intervalMs);
    setAnalysisInterval(interval);
    toast.success("تم بدء التحليل التلقائي");
  };

  const stopAnalysis = () => {
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
    setIsAnalyzing(false);
    toast.success("تم إيقاف التحليل التلقائي");
  };

  useEffect(() => {
    return () => {
      if (analysisInterval) {
        clearInterval(analysisInterval);
      }
    };
  }, []);

  return (
    <AutoAnalysisButton
      isAnalyzing={isAnalyzing}
      onClick={isAnalyzing ? stopAnalysis : startAnalysis}
      disabled={!symbol || !price}
    />
  );
};

const getIntervalInMs = (interval: string): number => {
  switch (interval) {
    case "1m": return 60 * 1000;
    case "5m": return 5 * 60 * 1000;
    case "30m": return 30 * 60 * 1000;
    case "1h": return 60 * 60 * 1000;
    case "4h": return 4 * 60 * 60 * 1000;
    case "1d": return 24 * 60 * 60 * 1000;
    default: return 5 * 60 * 1000;
  }
};

const mapAnalysisTypeToDbValue = (type: string): string => {
  const mapping: { [key: string]: string } = {
    'scalping': 'سكالبينج',
    'smc': 'SMC',
    'ict': 'ICT',
    'turtleSoup': 'Turtle Soup',
    'gann': 'Gann',
    'waves': 'Waves',
    'patterns': 'Patterns',
    'priceAction': 'Price Action',
    'smart': 'Smart'
  };
  return mapping[type] || 'عادي';
};

const saveAnalysisToHistory = async (
  result: any,
  symbol: string,
  timeframe: string,
  analysisType: string,
  userId: string
) => {
  try {
    console.log("Saving analysis to history with user_id:", userId);
    const mappedAnalysisType = mapAnalysisTypeToDbValue(analysisType);
    console.log("Mapped analysis type:", mappedAnalysisType);
    
    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        symbol: symbol.toUpperCase(),
        current_price: result.currentPrice,
        analysis: result.analysisResult,
        analysis_type: mappedAnalysisType,
        timeframe: timeframe
      });

    if (error) {
      console.error("Error saving analysis to history:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error saving analysis to history:", error);
    toast.error("حدث خطأ أثناء حفظ التحليل في السجل");
    throw error;
  }
};