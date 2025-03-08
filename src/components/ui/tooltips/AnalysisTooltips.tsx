
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface AnalysisTooltipProps {
  content: string;
  children: ReactNode;
}

export function AnalysisTooltip({ content, children }: AnalysisTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center cursor-help">
            {children}
            <InfoIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const analysisTypeTooltips = {
  // Legacy analysis types
  "Scalping": "Short-term analysis focusing on quick trades with small targets",
  "SMC": "Smart Money Concept analysis focusing on institutional money movements",
  "ICT": "Inner Circle Trader - analytical approach focusing on market maker behavior",
  "Turtle Soup": "Trading strategy targeting false breakouts",
  "Gann": "Gann theory based on the relationship between price and time",
  "Waves": "Elliott Wave analysis to identify market trends",
  "Patterns": "Analysis of technical patterns on the chart",
  "Price Action": "Price movement analysis without indicators",
  "Smart": "Analysis using artificial intelligence to combine multiple analytical approaches",
  
  // New analysis types
  "Fibonacci": "Strategy based on Fibonacci retracement and extension levels to determine entry and exit points",
  "Advanced Fibonacci": "Advanced analysis using Fibonacci levels with other tools to infer precise reversal and correction points",
  "Neural Networks": "Using artificial neural networks to analyze data and predict price movement",
  "Recurrent Neural Networks": "Advanced neural networks used to predict time series and recurring patterns",
  "Time Clustering": "Analysis based on repetition of time patterns and price clusters in specific time periods",
  "Multi Variance": "Analysis studying the relationship between multiple variables to predict price movement",
  "Composite Candlestick": "Analysis strategy that combines multiple candle patterns to infer more accurate entry and exit signals",
  "Behavioral Analysis": "Analysis of trader behavior and psychology to predict market movements"
};

export const timeframeTooltips = {
  "1m": "Very short timeframe (1 minute) suitable for scalping",
  "5m": "Short timeframe (5 minutes) suitable for short day trading",
  "30m": "Medium-short timeframe (30 minutes) for day trading",
  "1h": "Medium timeframe (1 hour) suitable for day and medium trading",
  "4h": "Medium-long timeframe (4 hours) for medium trading",
  "1d": "Long timeframe (1 day) suitable for long-term trading"
};
