
import { Badge } from "@/components/ui/badge";

interface AnalysisCountBadgeProps {
  count: number;
  className?: string;
}

export const AnalysisCountBadge = ({ count, className = "" }: AnalysisCountBadgeProps) => (
  <Badge variant="secondary" className={`text-sm ${className}`}>
    {count} تحليل
  </Badge>
);
