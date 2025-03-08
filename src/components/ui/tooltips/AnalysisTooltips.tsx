
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
  "Smart": "Analysis using artificial intelligence to combine multiple analytical approaches",
  "SMC": "Smart Money Concept analysis focusing on institutional money movement",
  "Market Structure Theory": "Smart Money Concept analysis focusing on institutional money movement",
  "ICT": "Inner Circle Trader - analytical approach focusing on market maker behavior",
  "Market Theory": "Inner Circle Trader - analytical approach focusing on market maker behavior",
  "Turtle Soup": "Trading strategy targeting false breakouts",
  "Gann": "Gann theory based on price-time relationships",
  "Waves": "Elliott Wave analysis to determine market trends",
  "Volatility": "Elliott Wave analysis to determine market trends",
  "Patterns": "Analysis of technical patterns on charts",
  "Pattern": "Analysis of technical patterns on charts",
  "Price Action": "Price movement analysis without indicators",
  
  // New analysis types
  "Fibonacci": "Strategy using Fibonacci retracement and extension levels to determine entry and exit points",
  "Fibonacci Advanced": "Advanced analysis using Fibonacci levels with other tools to derive precise reversal and correction points",
  "Neural Network": "Using artificial neural networks to analyze data and predict price movement",
  "Neural Networks": "Using artificial neural networks to analyze data and predict price movement",
  "RNN": "Advanced neural networks used for time series prediction and recurring patterns",
  "Time Clustering": "Analysis based on recurring time patterns and price clusters in specific time periods",
  "Multi Variance": "Analysis studying relationships between multiple variables to predict price movement",
  "Composite Candlestick": "Analysis strategy combining multiple candlestick patterns to derive more accurate entry and exit signals",
  "Behavioral": "Analysis of trader behavior and psychology to predict market movements"
};

export const timeframeTooltips = {
  "1m": "Very short timeframe (1 minute) suitable for scalping",
  "5m": "Short timeframe (5 minutes) suitable for short day trading",
  "30m": "Medium-short timeframe (30 minutes) for day trading",
  "1h": "Medium timeframe (1 hour) suitable for day and medium-term trading",
  "4h": "Medium-long timeframe (4 hours) for medium-term trading",
  "1d": "Long timeframe (1 day) suitable for long-term trading"
};
