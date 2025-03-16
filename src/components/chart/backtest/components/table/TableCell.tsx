
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface TableCellProps {
  label: string;
  value: string | ReactNode;
  tooltipEnabled?: boolean;
  className?: string;
}

export const TableCell = ({ 
  label, 
  value, 
  tooltipEnabled = true,
  className = "truncate"
}: TableCellProps) => {
  if (!tooltipEnabled) {
    return <div className={className}>{value}</div>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={className}>{value}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}: {typeof value === 'string' ? value : label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
