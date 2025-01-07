import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const useAutoAnalysis = (
  symbol: string,
  price: string,
  selectedTimeframes: string[],
  selectedInterval: string,
  selectedAnalysisTypes: string[]
) => {
  const { user } = useAuth();
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

  useEffect(() => {
    return () => {
      if (analysisInterval) {
        clearInterval(analysisInterval);
      }
    };
  }, []);

  return {
    isAnalyzing,
    setIsAnalyzing,
    analysisInterval,
    setAnalysisInterval,
    validateInputs,
    getIntervalInMs,
    user
  };
};