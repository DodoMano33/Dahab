import { Badge } from "@/components/ui/badge";

interface AnalysisCountBadgeProps {
  count: number;
}

export const AnalysisCountBadge = ({ count }: AnalysisCountBadgeProps) => (
  <Badge variant="secondary" className="text-sm">
    {count} تحليل
  </Badge>
);