import { AnalysisData } from "@/types/analysis";

export type SearchHistoryItem = {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  targetHit?: boolean;
  stopLossHit?: boolean;
  analysisType: "عادي" | "سكالبينج" | "ذكي" | "SMC" | "ICT" | "Turtle Soup";
};